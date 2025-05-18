import {
    Activity,
    Media
} from "../models/config/config.models.js";


export const createActivity = async (req, res) => {
    try {
        const {
            title,
            description,
            time,
            location,
            start_time,
            end_time
        } = req.body;
        let imageUrl;

        upload.single("photo")(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    error: "File upload failed",
                    details: err
                });
            }
            const file = req.file;

            if (!file) {
                return res.status(400).json({
                    error: "No file uploaded"
                });
            }
            // Use the shared service to upload to Google Drive
            const { webViewLink } = await uploadFileToGoogleDrive(file);
            imageUrl = webViewLink;
        });

        if (!title || !description || !time || !location || !start_time || !end_time) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newActivity = await Activity.create({
            user_id: req.user.id,
            title,
            description,
            image: imageUrl ? true : false,
            time,
            location
        });

        if (imageUrl) {
            const media = await Media.create({
                ref_id: newActivity.id,
                url: imageUrl,
                type: "image",
            });
        }

        res.status(201).json({
            success: true,
            message: "Activity created successfully",
            activity: newActivity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating activity",
            error: error.message
        });
    }
}

export const getActivity = async (req, res) => {
    try {
        const activities = await Activity.findAll({where: {user_id: req.user.id}});
        if (!activities) {
            return res.status(404).json({
                success: false,
                message: "No activities found"
            });
        }
        res.status(200).json({
            success: true,
            activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activities",
            error: error.message
        });
    }
}
export const getActivitybyId = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findOne({ where: { id } });
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }
        res.status(200).json({
            success: true,
            activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching activity",
            error: error.message
        });
    }
}
export const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, time, location, start_time, end_time } = req.body;

        const activity = await Activity.findOne({ where: { id } });
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        await activity.update({
            title,
            description,
            time,
            location,
            start_time,
            end_time
        });

        res.status(200).json({
            success: true,
            message: "Activity updated successfully",
            activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating activity",
            error: error.message
        });
    }
}
export const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findOne({ where: { id } });
        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        }

        await activity.destroy();

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting activity",
            error: error.message
        });
    }
}