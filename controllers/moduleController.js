import {
    User,
    Role,
    UserRole
} from "../models/config/config.models.js";

export const addRole = async (req, res) => {
    const {
        role
    } = req.body; // Extract role from request body

    if (!role) {
        return res.status(400).send({
            success: false,
            message: "Role is required",
        });
    }

    try {

        const existingRole = await Role.findOne({
            where: {
                role_name: role
            }
        }); // Check if the role already exists
        if (existingRole) {
            return res.status(400).send({
                success: false,
                message: "Role already exists",
            });
        }

        const newRole = new Role({
            role_name: role
        });
        await newRole.save();

        res.status(201).send({
            success: true,
            message: "Role added successfully",
            role: newRole,
        });
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Role not added",
            error: error.message,
        });
    }
};


export const deleteRole = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Debugging log
        console.log(req.body)

        const {
            role
        } = req.body; // Get roleId from the request body

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "role is required",
            });
        }

        const deletedRole = await Role.findOne({where: {
            role_name: role
        }}); // Find the role by ID
        if (!deletedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        deletedRole.destroy(); // Delete the role

        res.status(200).json({
            success: true,
            message: "Role removed successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Role not removed",
            error: error.message,
        });
    }
};


export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll(); // Fetch all roles from the database
        if (roles.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No roles found in the database",
            });
        }
        res.status(200).send({
            success: true,
            message: "Roles fetched successfully",
            roles,
        });

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in fetching roles",
            error: error.message,
        });
    }
}

export const setRole = async (req, res) => {
    try {
        const {
            userId,
            roleId
        } = req.body; // Get userId and roleId from request
        console.log(req.body)
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        console.log(user)
        // Check if the role exists
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        console.log(role)
        // Check if the user already has this role
        const existingUserRole = await UserRole.findOne({where: {
            user_id: userId,
            role_id: roleId
        }});
        if (existingUserRole) {
            return res.status(400).json({
                success: false,
                message: "User already has this role",
            });
        }

        // Assign the role to the user
        const userRole = UserRole.create({
            user_id: userId,
            role_id: roleId
        });

        res.status(201).json({
            success: true,
            message: "Role assigned successfully",
            userRole,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error assigning role",
            error: error.message,
        });
    }
};