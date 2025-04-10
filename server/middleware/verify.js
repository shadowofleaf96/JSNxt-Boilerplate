const { validationResult } = require("express-validator");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

const Verify = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.sendStatus(401);
    }
    
    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "This session has expired. Please login" });
      }

      const { id } = decoded;
      const user = await User.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const { password, ...data } = user._doc;
      req.user = data;
      next();
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};

module.exports = Verify;
