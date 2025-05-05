import axios from "axios";
import User from "../models/Users";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Blacklist from "../models/Blacklist";
import * as crypto from "crypto";
import { auth, OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import sendEmail from "../middleware/sendEmail";
import { generateUniqueUsername } from "../utils/generateUsername";
import { getPublicUrl } from "@/utils/fileUtils";
import {
  getWelcomeEmailTemplate,
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getLoginAlertTemplate,
  passwordChangedTemplate,
  accountVerifiedTemplate,
} from "../utils/emailTemplates";
import { Op } from "sequelize";

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const LOGO_URL = process.env.LOGO_URL;
const secretKey = process.env.RECAPTCHA_SECRET_KEY;

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, username, password, email, role, status } = req.body;
    let avatarUrl = null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        status: "failed",
        message: "It seems you already have an account, please log in instead.",
      });
      return;
    }

    if (req.file) {
      avatarUrl = getPublicUrl(req.file.path);
    }

    await User.create({
      authProvider: "local",
      name,
      username,
      password,
      email,
      role,
      status,
      avatar: avatarUrl,
      isVerified: true,
    });

    const loginPath = role === "admin" ? "/admin/login" : "/login";
    const loginUrl = `${process.env.FRONTEND_URL}${loginPath}`;

    await sendEmail({
      to: email,
      subject: "Welcome to JSNXT!",
      html: getWelcomeEmailTemplate({
        logoUrl: LOGO_URL,
        frontendUrl: process.env.FRONTEND_URL,
        user: { name },
        action: {
          url: loginUrl,
          text: "Log In",
        },
      }),
    });

    res.status(200).json({
      status: "success",
      message: "User created and welcome email sent successfully.",
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name, recaptchaToken } = req.body;

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: "reCAPTCHA verification failed." });
        return;
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          status: "failed",
          message: "It seems you already have an account. Please log in.",
        });
        return;
      }

      const generatedUsername = await generateUniqueUsername(name);

      let avatarUrl = null;

      if (req.file) {
        avatarUrl = getPublicUrl(req.file.path);
      } else {
        avatarUrl = `${process.env.BACKEND_URL}/public/images/userIcon.png`;
      }

      const emailToken = crypto.randomBytes(64).toString("hex");

      const newUser = await User.create({
        authProvider: "local",
        email,
        name,
        password,
        username: generatedUsername,
        avatar: avatarUrl,
        role: "user",
        status: "active",
        emailToken,
        isVerified: false,
      });

      const verifyLink = `${BACKEND_URL}/api/users/verify-email/${emailToken}`;

      await sendEmail({
        to: newUser.email,
        subject: "JSNXT - Verify your email",
        html: getVerificationEmailTemplate({
          logoUrl: LOGO_URL,
          action: {
            url: verifyLink,
            text: "Verify Email",
          },
        }),
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
  } catch (error) {
    res.status(500).json({ message: "reCAPTCHA verification error." });
    return;
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { emailToken: token } });
    if (!user) {
      res.status(400).send("Invalid or expired token.");
      return;
    }

    user.emailToken = undefined;
    user.isVerified = true;
    user.status = "active";
    await user.save();

    const loginToken = await user.generateAccessJWT();

    await sendEmail({
      to: user.email,
      subject: "JSNXT - Welcome to JSNXT 🎉",
      html: accountVerifiedTemplate({
        logoUrl: LOGO_URL,
        frontendUrl: FRONTEND_URL,
      }),
    });

    res.redirect(`${FRONTEND_URL}/email-verified/${loginToken}`);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Email verification failed.");
    return;
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const ua = req.useragent;
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { credential, recaptchaToken } = req.body;

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const response = await axios.post(verificationURL);
    const { success, score } = response.data as {
      success: boolean;
      score: number;
    };

    if (!success || score < 0.5) {
      res.status(403).json({ message: "reCAPTCHA verification failed" });
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      res.status(400).json({ message: "Email not verified by Google" });
      return;
    }

    let user = await User.findOne({
      where: {
        [Op.or]: [{ email: payload.email }, { googleId: payload.sub }],
      },
    });

    if (user?.authProvider === "local") {
      res.status(409).json({
        message: "Email already registered with password",
      });
      return;
    }

    const isNewUser = !user;

    if (!user) {
      const generatedUsername = await generateUniqueUsername(payload.name);

      user = await User.create({
        email: payload.email,
        name: payload.name,
        username: generatedUsername,
        avatar: payload.picture,
        authProvider: "google",
        googleId: payload.sub,
        role: "user",
        status: "active",
        isVerified: true,
      });
    }

    const token = await user.generateAccessJWT();
    const { password: _, ...userData } = user.get({ plain: true });

    if (isNewUser) {
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
              <a href="${FRONTEND_URL}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Go to Home</a>
            </div>
            <p style="font-size:14px;color:#999999">If you have any questions, feel free to contact our support team.</p>
          </div>
        `,
      });
    } else {
      await sendEmail({
        to: user.email,
        subject: "JSNXT - New Login Detected",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0;">
          <div style="text-align: center;">
            <img src="${LOGO_URL}" alt="JSNXT Logo" style="width: 100px; margin-bottom: 20px;" />
            <h2>New Login Detected</h2>
          </div>
          <p>We noticed a new login to your JSNXT account with the following details:</p>
          <ul>
            <li><strong>IP Address:</strong> ${ipAddress}</li>
            <li><strong>Browser:</strong> ${ua?.browser}</li>
            <li><strong>Platform:</strong> ${ua?.platform}</li>
            <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p>If this was you, no further action is needed. If you suspect any unauthorized access, please reset your password immediately.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} JSNXT. All rights reserved.</p>
        </div>
      `,
      });
    }

    res.json({
      status: "success",
      data: userData,
      token,
    });
    return;
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const ua = req.useragent;
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { identifier, password, recaptchaToken } = req.body;

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const response = await axios.post(verificationURL);
    const { success, score } = response.data as {
      success: boolean;
      score: number;
    };

    if (!success || score < 0.5) {
      res.status(403).json({ message: "reCAPTCHA verification failed." });
      return;
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier, role: "user" },
          { username: identifier, role: "admin" },
        ],
      },
      attributes: { include: ["password", "authProvider"] },
    });

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

    if (user.authProvider === "google") {
      res.status(401).json({
        status: "failed",
        message:
          "This account was registered with Google. Please use Google Sign-In.",
      });
      return;
    }

    if (!user.password) {
      res.status(401).json({
        status: "failed",
        message: "Password not set. Please use password reset.",
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

    const token = await user.generateAccessJWT();
    const { password: _, ...user_data } = user.get({ plain: true });

    await sendEmail({
      to: user_data.email,
      subject: "JSNXT - New Login Detected",
      html: getLoginAlertTemplate({
        logoUrl: LOGO_URL,
        ipAddress: ipAddress[0],
        browser: ua.browser,
        platform: ua.platform,
      }),
    });

    res.status(200).json({
      status: "success",
      data: user_data,
      token,
      message: `Successfully logged in as ${user.role}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll();
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
    const existingUser = await User.findByPk(id);
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
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({
      status: "success",
      user: req.user,
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
      updates.avatar = getPublicUrl(req.file.path);
    }

    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    if (updates.email || updates.username) {
      const userWithEmail = await User.findOne({
        where: { email: updates.email },
      });
      const userWithUsername = await User.findOne({
        where: { username: updates.username },
      });

      if (userWithEmail && userWithEmail.id.toString() !== id) {
        res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }

      if (userWithUsername && userWithUsername.id.toString() !== id) {
        res
          .status(400)
          .json({ message: "Username is already in use by another user" });
      }
    }

    if (existingUser.authProvider === "google" && updates.password) {
      delete updates.password;
    }

    await User.update(updates, {
      where: { id },
    });

    const updatedUser = await User.findByPk(id);

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
  const { id } = req.params;

  try {
    const deletedCount = await User.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
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
    const { email, recaptchaToken } = req.body;
    const user = await User.findOne({ where: { email } });
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
      const response = await axios.post(verificationURL);
      const { success, score } = response.data as {
        success: boolean;
        score: number;
      };

      if (!success || score < 0.5) {
        res.status(403).json({ message: "reCAPTCHA verification failed." });
        return;
      }

      if (!user) {
        res.status(404).json({ message: "No user with that email." });
        return;
      }

      if (user.authProvider === "google") {
        res.status(404).json({
          message:
            "This account uses Google login. Please sign in with Google.",
        });
        return;
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 3600000;
      await user.save();

      const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

      await sendEmail({
        to: email,
        subject: "JSNXT - Reset your password",
        html: getPasswordResetTemplate({
          logoUrl: LOGO_URL,
          action: {
            url: resetUrl,
          },
        }),
      });

      res.status(200).json({ message: "Password reset email sent." });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error." });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "reCAPTCHA verification error." });
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
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { [Op.gt]: Date.now() },
      },
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
      html: passwordChangedTemplate({
        logoUrl: LOGO_URL,
      }),
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
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No user is currently logged in." });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No user is currently logged in." });
      return;
    }

    const existingToken = await Blacklist.findOne({ where: { token } });
    if (existingToken) {
      res.status(401).json({ message: "The session is already terminated." });
      return;
    }

    const newBlacklist = new Blacklist({ token });
    await newBlacklist.save();

    res.status(200).json({ message: "You have successfully logged out." });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};
