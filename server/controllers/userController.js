const User = require("../models/Users");
const Blacklist = require("../models/Blacklist");
const bcrypt = require("bcrypt");

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
    const { name, username, email, password } = req.body;
    const avatar = req.file
      ? req.file.path
      : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "It seems you already have an account. Please log in.",
      });
    }

    const emailToken = crypto.randomBytes(64).toString("hex");

    const newUser = new User({
      name,
      username,
      email,
      password,
      avatar,
      role: "user",
      status: "active",
      emailToken,
      isVerified: false,
    });

    await newUser.save();

    const verifyLink = `${BACKEND_URL}/api/auth/verify-email?token=${emailToken}`;
    await sendEmail({
      to: email,
      subject: "JSNxt - Verify your email",
      html: `
        <h3>Hi ${name},</h3>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
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
    const { token } = req.query;

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
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message:
          "Invalid username or password. Please try again with the correct credentials.",
      });
    }

    if (user.status === "inactive") {
      return res.status(401).json({
        status: "failed",
        message:
          "This account is inactive, please try again later or use an active account instead",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "failed",
        message:
          "Invalid username or password. Please try again with the correct credentials.",
      });
    }

    const token = user.generateAccessJWT();

    const { password: _, ...user_data } = user._doc;

    res.status(200).json({
      status: "success",
      data: user_data,
      token,
      message: "You have successfully logged in.",
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
