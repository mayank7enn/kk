import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    transporter
} from '../config/nodeMailer.js'
import {
    User,
    Role,
    UserRole
} from "../models/config/config.models.js";

export const register = async (req, res) => {
    const {
        name,
        email,
        username,
        password
    } = req.body;

    if (!name || !username ||!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    try {
        const existingUser = await User.findOne({
            where: {
            [Op.or]: [
                { email },
                { username }
            ]
            }
        });

        if (existingUser) {
            const conflictField = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({
            success: false,
            message: `User already exists with this ${conflictField}, try a different ${conflictField}`
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        // ✅ Assign default role ('user')
        const defaultRole = await Role.findOne({where: {
            role_name: 'user'
        }});

        if (!defaultRole) {
            return res.status(500).json({
                success: false,
                message: 'Default role not found'
            });
        }

        // ✅ Create new user
        const user = await User.create({
            name,
            email,
            password_hash: hashedPassword,
            role_id: defaultRole.id,
        });

        await UserRole.create({
            user_id: user.id,
            role_id: defaultRole.id
        });

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide both email and password'
        });
    }

    try {
        // ✅ Check if user exists
        const user = await User.findOne({
            where: {
            [Op.or]: [
                { email },
                { username }
            ]
            }
        });

        if (!user) {
            return res.status(404).json({
            success: false,
            message: 'User not found'
            });
        }

        // ✅ Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // ✅ Fetch user role
        const userRole = await UserRole.findOne({where: {
            user_id: user.id
        }});
        
        const role = await Role.findByPk(userRole?.role_id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        const roleName = role.role_name;
        // ✅ Generate JWT token with role
        const token = jwt.sign({
            id: user.id,
            role: roleName || 'user'
        },
            process.env.JWT_SECRET, {
            expiresIn: '1d'
        }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: {
                name: user.name,
                email: user.email,
                role: roleName || 'user',
            },
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const sendVerifyOtp = async (req, res) => {
    try {
        const {
            email
        } = req.body;
        console.log(req.body)
        const user = await User.findOne({
            where: {
                email
            }
        });
        console.log(user)
        if (user.isAccountVerified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified'
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        user.verifyOtp = otp.toString();
        user.verifyOtpExpiredAt = Date.now() + 10 * 60 * 1000;

        await user.save();
        console.log(user)

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Welcome to our authentication system, your account verification OTP is: ${otp}`,
        }
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const verifyEmail = async (req, res) => {
    const {
        email,
        otp
    } = req.body;
    console.log(req.body)

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.verifyOtp.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        // Mark the account as verified
        user.isAccountVerified = true;
        user.verifyOtp = ''; // Instead of null
        user.verifyOtpExpiredAt = 0;


        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const sendPasswordResetOtp = async (req, res) => {
    try {
        const {
            email
        } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);

        user.resetOtp = otp.toString();

        user.resetOtpExpiredAt = Date.now() + 10 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Welcome to our authentication system, your account's Password change OTP is: ${otp}`,
        }

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const resetPassword = async (req, res) => {
    const {
        email,
        otp,
        newPassword
    } = req.body;

    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.resetOtp.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpiredAt = null;

        await user.save();

        // Generate new JWT token after password reset
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Set the token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            token: token, // Return the new token in the response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you get `userId` from authentication middleware

        // Fetch user details
        const user = await User.findOne({
            where: {
                id: userId
            },
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Fetch role from UserRole and populate it
        // Using Sequelize syntax
        //  to fetch role
        const userRole = await UserRole.findOne({
            where: { user_id: userId }
        });

        // Get the role information if userRole exists
        const role = userRole ? await Role.findByPk(userRole.roleId) : null;

        return res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                photo: user.photo,
                role: userRole?.role || "user", // Default role if not found
            },
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you get `userId` from authentication middleware

        const {
            name,
            email,
            photo
        } = req.body;

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
            userId, {
            name,
            email,
            photo,
            updatedAt: Date.now()
        }, {
            new: true,
            runValidators: true
        }
        ).select("-password"); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};