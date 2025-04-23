const User = require("../models/Users");
const Blacklist = require("../models/Blacklist");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../middleware/sendEmail");
const BACKEND_URL = process.env.BACKEND_URL;

exports.createUser = async (req, res) => {
  try {
    const { name, username, password, email, role, status } = req.body;
    const avatar = req.file ? req.file.path : null;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "It seems you already have an account, please log in instead.",
      });
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const avatar =
      "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "It seems you already have an account. Please log in.",
      });
    }

    const emailToken = crypto.randomBytes(64).toString("hex");

    const generatedUsername = username || `user_${Date.now()}`;

    const newUser = new User({
      email,
      password,
      username: generatedUsername,
      avatar,
      role: "user",
      status: "active",
      emailToken,
      isVerified: false,
    });

    await newUser.save();

    const verifyLink = `${BACKEND_URL}/api/auth/verify-email/${emailToken}`;
    await sendEmail({
      to: email,
      subject: "JSNXT - Verify your email",
      html: `
        <h3>Welcome!</h3>
        <p>Thank you for registering. Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
    });

    return res.status(201).json({
      status: "success",
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or expired token.",
      });
    }

    user.emailToken = null;
    user.isVerified = true;
    user.status = "active";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully. You can now log in.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Email verification failed.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [
        { email: identifier, role: "user" }, 
        { username: identifier, role: "admin" }, 
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials. Please try again.",
      });
    }

    if (user.status === "inactive") {
      return res.status(401).json({
        status: "failed",
        message:
          user.role === "admin"
            ? "Admin account is inactive. Contact superadmin."
            : "User account is inactive. Please contact support.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid credentials. Please try again.",
      });
    }

    const token = user.generateAccessJWT();
    const { password: _, ...user_data } = user._doc;

    res.status(200).json({
      status: "success",
      data: user_data,
      token,
      message: `Successfully logged in as ${user.role}`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        user: existingUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.avatar = req.file.path;
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
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
        return res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }

      if (userWithUsername && userWithUsername._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "Username is already in use by another user" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(500).json({
        status: "failed",
        message: "User not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: updatedUser,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findByIdAndDelete(id);
    if (!existingUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "This user is deleted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No user is currently logged in." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No user is currently logged in." });
    }

    const checkIfBlacklisted = await Blacklist.findOne({ token });
    if (checkIfBlacklisted) {
      return res
        .status(401)
        .json({ message: "The session is already terminated." });
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
