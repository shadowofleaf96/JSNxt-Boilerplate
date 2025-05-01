import express, { Request, Response, NextFunction } from "express";
import * as userController from "../controllers/userController";
import { uploadAvatar } from "../middleware/multer";
import Verify from "../middleware/verify";
import VerifyRole from "../middleware/verifyRole";
const router = express.Router();

router.get("/getuser/:id", userController.getUserInfo);
router.get("/getallusers", userController.getAllUsers);
router.get("/profile", Verify, userController.profile);
router.get("/verify-email/:token", userController.verifyEmail);
router.post("/logout", userController.logout);
router.post("/register", uploadAvatar, userController.registerUser);
router.post(
  "/create-user",
  uploadAvatar,
  Verify,
  VerifyRole,
  userController.createUser
);
router.post("/forgot-password", userController.forgotPassword);
router.put("/reset-password/:token", userController.resetPassword);
router.post("/login", userController.login);
router.post("/google-login", userController.googleAuth);
router.put(
  "/:id",
  uploadAvatar,
  Verify,
  VerifyRole,
  userController.updateUser
);
router.delete("/:id", Verify, VerifyRole, userController.deleteUser);

export default router;
