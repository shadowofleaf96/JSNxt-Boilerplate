import User from "../models/Users";
import { UserDocument } from "../types/user.interface";
import Blacklist from "../models/Blacklist";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as crypto from "crypto";
import sendEmail from "../middleware/sendEmail";

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const LOGO_URL = `${FRONTEND_URL}/jsnxt-logo-black.webp`;

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, username, password, email, role, status } = req.body;
    const avatar = req.file ? req.file.path : null;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "failed",
        message: "It seems you already have an account, please log in instead.",
      });
      return;
    }

    const newUser = new User({
      name,
      username,
      password: password,
      email,
      role,
      status,
      avatar,
    });
    await newUser.save();
    res.status(200).json({
      status: "success",
      message:
        "Thank you for registering with us. Your account has been successfully created.",
    });
    return;
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, username, name } = req.body;

    const avatar = "public/images/userIcon.png";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        status: "failed",
        message: "It seems you already have an account. Please log in.",
      });
      return;
    }

    const emailToken = crypto.randomBytes(64).toString("hex");

    const generatedUsername = username || `user_${Date.now()}`;

    const newUser = new User({
      email,
      name,
      password,
      username: generatedUsername,
      avatar,
      role: "user",
      status: "active",
      emailToken,
      isVerified: false,
    });

    await newUser.save();

    const verifyLink = `${BACKEND_URL}/api/users/verify-email/${emailToken}`;
    await sendEmail({
      to: email,
      subject: "JSNXT - Verify your email",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
          <div style="text-align:center;margin-bottom:20px">
            <img src="${LOGO_URL}" alt="JSNXT Logo" style="width:80px;height:auto" />
          </div>
          <h2 style="color:#333333">Welcome to JSNXT!</h2>
          <p style="font-size:16px;color:#555555">
            Thank you for registering. Please confirm your email address by clicking the button below:
          </p>
          <div style="margin:30px 0;text-align:center">
            <a href="${verifyLink}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Verify Email</a>
          </div>
          <p style="font-size:14px;color:#999999">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(201).json({
      status: "success",
      message:
        "Registration successful. Please check your email to verify your account.",
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
    return;
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      res.status(400).send("Invalid or expired token.");
      return;
    }

    user.emailToken = undefined;
    user.isVerified = true;
    user.status = "active";
    await user.save();

    const loginToken = user.generateAccessJWT();
    await sendEmail({
      to: user.email,
      subject: "Welcome to JSNXT 🎉",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
          <div style="text-align:center;margin-bottom:20px">
            <img src="${LOGO_URL}" alt="JSNXT Logo" style="width:80px;height:auto" />
          </div>
          <h2 style="color:#333333">Your account is now verified!</h2>
          <p style="font-size:16px;color:#555555">
            You're all set to explore JSNXT. We’re excited to have you onboard!
          </p>
          <div style="margin:30px 0;text-align:center">
            <a href="${FRONTEND_URL}/dashboard" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Go to Dashboard</a>
          </div>
          <p style="font-size:14px;color:#999999">If you have any questions, feel free to contact our support team.</p>
        </div>
      `,
    });

    res.redirect(`${FRONTEND_URL}/email-verified?token=${loginToken}`);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Email verification failed.");
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier, role: "user" },
        { username: identifier, role: "admin" },
      ],
    }).select("+password");

    if (!user) {
      res.status(401).json({
        status: "failed",
        message: "Invalid credentials. Please try again.",
      });
      return;
    }

    if (user.status === "inactive") {
      res.status(401).json({
        status: "failed",
        message:
          user.role === "admin"
            ? "Admin account is inactive. Contact superadmin."
            : "User account is inactive. Please contact support.",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: "failed",
        message: "Invalid credentials. Please try again.",
      });
      return;
    }

    const token = user.generateAccessJWT();
    const { password: _, ...user_data } = user.toObject();

    res.status(200).json({
      status: "success",
      data: user_data,
      token,
      message: `Successfully logged in as ${user.role}`,
    });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
    return;
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
      return;
    } else {
      res.status(200).json({
        status: "success",
        user: existingUser,
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      user,
    });
    return;
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.avatar = req.file.path;
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    if (updates.email || updates.username) {
      const userWithEmail = await User.findOne({ email: updates.email });
      const userWithUsername = await User.findOne({
        username: updates.username,
      });

      if (userWithEmail && userWithEmail._id.toString() !== id) {
        res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }

      if (userWithUsername && userWithUsername._id.toString() !== id) {
        res
          .status(400)
          .json({ message: "Username is already in use by another user" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      res.status(500).json({
        status: "failed",
        message: "User not found",
      });
      return;
    } else {
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const existingUser = await User.findByIdAndDelete(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
      return;
    } else {
      res.status(200).json({
        status: "success",
        message: "This user is deleted successfully",
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "No user with that email." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = new Date(Date.now() + 3600000);
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "JSNXT - Reset your password",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
          <div style="text-align:center;margin-bottom:20px">
            <img src="${LOGO_URL}" alt="JSNXT Logo" style="width:80px;height:auto" />
          </div>
          <h2 style="color:#333333">Reset Your Password</h2>
          <p style="font-size:16px;color:#555555">
            We received a request to reset your password. Click the button below to choose a new one:
          </p>
          <div style="margin:30px 0;text-align:center">
            <a href="${resetUrl}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Reset Password</a>
          </div>
          <p style="font-size:14px;color:#999999">If you did not request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "Password reset email sent." });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
    return;
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password } = req.body as { password: string };
    const { token } = req.params;

    if (!password) {
      res.status(400).json({ message: "Please provide a new password." });
      return;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token." });
      return;
    }

    user.password = password;
    user.resetPasswordToken = "";
    user.resetPasswordExpire = undefined;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "JSNXT - Password Changed Successfully",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
          <div style="text-align:center;margin-bottom:20px">
            <img src="${LOGO_URL}" alt="JSNXT Logo" style="width:80px;height:auto" />
          </div>
          <h2 style="color:#333333">Your Password Has Been Updated</h2>
          <p style="font-size:16px;color:#555555">
            This is a confirmation that your password has been successfully changed.
          </p>
          <p style="font-size:14px;color:#999999">
            If you did not perform this action, please contact support immediately.
          </p>
        </div>
      `,
    });
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again." });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      message: `Successfully logged out from ${user?.role}`,
    });
    return;
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
    return;
  }
};
