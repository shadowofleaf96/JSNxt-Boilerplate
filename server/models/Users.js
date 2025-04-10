const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const UserSchema = mongoose.Schema(
  {
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    emailToken: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "User",
  }
);

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(12, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(update.password, salt);
    update.password = hash;
  }

  next();
});

UserSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(update.password, salt);
    update.password = hash;
  }

  next();
});

UserSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "10d",
  });
};

module.exports = mongoose.model("users", UserSchema);
