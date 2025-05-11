import Community from "../models/community.models";
import CommunityMembership from "../models/communityMembership.models";
import Post from "../models/post.models.js";

// controllers/communityController.js

import { uploadCommunityMediaToGoogleDrive } from '../services/driveService.js';

export const createCommunity = async (req, res) => {
    try {
        // Step 1: Extract text fields from req.body
        const { name, description, created_by } = req.body;

        // Step 2: Make sure both avatar and banner files are present
        const { avatar, banner } = req.files;

        if (!avatar || !banner) {
            return res.status(400).json({
                success: false,
                message: "Both avatar and banner images are required",
            });
        }

        // Step 3: Upload both files to Google Drive
        const { profilePhotoUrl, bannerUrl } = await uploadCommunityMediaToGoogleDrive({
            profilePhoto: avatar[0], // multer returns array even if single file
            banner: banner[0],
        });

        // Step 4: Create community with image URLs
        const community = await Community.create({
            name,
            description,
            created_by,
            avatar: profilePhotoUrl,
            banner: bannerUrl,
        });

        const communityMembership = await CommunityMembership.create({
            user_id: created_by,
            community_id: community.id,
            role: "admin", // Default role for the creator
            joined_at: new Date(),
        })

        res.status(201).json({
            success: true,
            message: "Community created successfully",
            community,
            communityMembership,
        });

    } catch (error) {
        console.error("Error creating community:", error);
        res.status(500).json({
            success: false,
            message: "Error creating community",
            error: error.message,
        });
    }
};

export const getCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch community by ID
        const community = await Community.findOne({
            where: { id },
        });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Community fetched successfully",
            community,
        });
    } catch (error) {
        console.error("Error fetching community:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching community",
            error: error.message,
        });
    }
}

export const joinCommunity = async (req, res) => {
    try {
        const { id } = req.params; // Community ID from URL
        const userId = req.user.id; // User ID from JWT token

        // Check if the community exists
        const community = await Community.findOne({
            where: { id },
        });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // Check if the user is already a member
        const existingMembership = await CommunityMembership.findOne({
            where: {
                user_id: userId,
                community_id: id,
            },
        });

        if (existingMembership) {
            return res.status(400).json({
                success: false,
                message: "You are already a member of this community",
            });
        }

        // Create a new membership
        const membership = await CommunityMembership.create({
            user_id: userId,
            community_id: id,
            role: "member", // Default role for new members
            joined_at: new Date(),
        });

        res.status(201).json({
            success: true,
            message: "Joined community successfully",
            membership,
        });
    } catch (error) {
        console.error("Error joining community:", error);
        res.status(500).json({
            success: false,
            message: "Error joining community",
            error: error.message,
        });
    }
}

export const assignRoles = async (req, res) => {
    try {
        const { communityId, userId, role } = req.body;

        // Validate input
        if (!communityId || !userId || !role) {
            return res.status(400).json({
                success: false,
                message: "Community ID, User ID, and Role are required",
            });
        }

        // Check if the community exists
        const community = await Community.findOne({
            where: { id: communityId },
        });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // Update the user's role in the community
        const membership = await CommunityMembership.findOne({
            where: {
                user_id: userId,
                community_id: communityId,
            },
        });
        if (!membership) {
            return res.status(404).json({
                success: false,
                message: "Membership not found",
            });
        }
    }catch (error) {
        console.error("Error assigning roles:", error);
        res.status(500).json({
            success: false,
            message: "Error assigning roles",
            error: error.message,
        });
    }

}

export const deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch community by ID
        const community = await Community.findOne({
            where: { id },
        });

        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        // Delete the community
        await community.destroy();

        res.status(200).json({
            success: true,
            message: "Community deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting community:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting community",
            error: error.message,
        });
    }
}

export const getCommunityMembers = async (req, res) => { }

export const postInCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const { content } = req.body;

        // Extract user ID from JWT token
        const userId = req.user.id;

        // Validate input
        if (!communityId || !content) {
            return res.status(400).json({
                success: false,
                message: "Community ID and content are required",
            });
        }

        upload.single("photo")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: "File upload failed", details: err });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Use the shared service to upload to Google Drive
            const { webViewLink } = await uploadFileToGoogleDrive(file);

            // Save post to DB or do other operations
            const post = await Post.create({
                content,
                photoUrl: webViewLink,
                userId,
                communityId,
                createdAt: new Date(),
            });

            res.status(201).json({
                success: true,
                message: "Post uploaded successfully",
                post: {
                    content: post.content,
                    photoUrl: post.photoUrl,
                },
            });
        });
    } catch (error) {
        console.error("Error posting in community:", error);
        res.status(500).json({
            success: false,
            message: "Error posting in community",
            error: error.message,
        });
    }
};

export const postEventInCommunity = async (req, res) => {
    try {
        const { communityId } = req.params;
        const {eventId} = req.body;
        const { content } = req.body;

        // Extract user ID from JWT token
        const userId = req.user.id;

        // Validate input
        if (!communityId || !content) {
            return res.status(400).json({ 
                success: false,
                message: "Community ID and content are required",
            });
        }
        upload.single("photo")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: "File upload failed", details: err });
            }

            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Use the shared service to upload to Google Drive
            const { webViewLink } = await uploadFileToGoogleDrive(file);

            // Save post to DB or do other operations
            const post = await Post.create({
                content,
                photoUrl: webViewLink,
                userId,
                communityId,
                createdAt: new Date(),
            });

            res.status(201).json({
                success: true,
                message: "Post uploaded successfully",
                post: {
                    content: post.content,
                    photoUrl: post.photoUrl,
                },
            });
        });
    } catch (error) {
        console.error("Error posting event in community:", error);
        res.status(500).json({
            success: false,
            message: "Error posting event in community",
            error: error.message,
        });
    }
}
