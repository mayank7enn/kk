import {
    User,
    Role,
    UserRole
} from "../models/config/config.models.js";
import { upload } from '../middleware/multerMiddleware.js'; // Adjust path as needed
import { uploadFileToGoogleDrive } from '../services/driveService.js';


//apis that will get made in ths file
// GET /users/me (Current user's profile)
// PUT /users/me
// DELETE /users/me
// GET /users/{userId} (Public profile)
// GET /users/{userId}/posts (User's posts across communities)


export const getUser = async (req, res) => {
    try {
        const { id } = req.body; // Extracting id from req.body
        console.log(req);
        const user = await User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['password_hash', 'created_at', 'updated_at']
            }
        });
        console.log("first")
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching user",
            error: error.message,
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.body; // Extracting id from req.body
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        await user.update(req.body);
        res.status(200).send({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error updating user",
            error: error.message,
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.body; // Extracting id from req.body
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        await user.destroy();
        res.status(200).send({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params; // Extracting id from req.params
        const user = await User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['password_hash', 'created_at', 'updated_at']
            }
        });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).send({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error fetching user",
            error: error.message,
        });
    }
}

export const getUserPosts = async (req, res) => { }

export const uploadPostWithPhoto = async (req, res) => {
    try {
        upload.single("photo")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: "File upload failed", details: err });
            }

            const { caption } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }

            // Use the shared service to upload to Google Drive
            const { webViewLink } = await uploadFileToGoogleDrive(file);

            // Save post to DB or do other operations
            const post = {
                caption,
                photoUrl: webViewLink,
                userId: req.body.id,
                createdAt: new Date(),
            };

            // Example: await PostModel.create(post);

            res.status(201).json({
                message: "Post uploaded successfully",
                post: {
                    caption: post.caption,
                    photoUrl: post.photoUrl,
                },
            });
        });
    } catch (error) {
        console.error("Error uploading post:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};