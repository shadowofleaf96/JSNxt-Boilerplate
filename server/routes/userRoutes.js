const express = require("express");
const userController = require("../controllers/userController");
const Validate = require("../middleware/validate");
const upload = require("../middleware/multer");
const { check } = require("express-validator");
const Verify = require("../middleware/verify");
const VerifyRole = require("../middleware/verifyRole");
const router = express.Router();

router.get("/getuser/:id", userController.getUserInfo);
router.get("/getallusers", userController.getAllUsers);
router.get("/profile", Verify, userController.profile);
router.post("/logout", userController.logout);
router.post(
  "/register",
  upload.single("avatar"),
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Must be at least 8 chars long"),
  Validate,
  userController.createUser
);
router.post(
  "/login",
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("password").not().isEmpty(),
  Validate,
  userController.login
);
router.put(
  "/:id",
  upload.single("avatar"),
  check("email")
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Must be at least 8 chars long"),
  Validate,
  userController.updateUser
);
router.delete("/:id", userController.deleteUser);

module.exports = router;
