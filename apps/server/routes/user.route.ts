import { Router } from "express";
import UserController from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
const userRouter = Router();

userRouter.put(
  "/update-user-info",
  authMiddleware,
  UserController.updateUserInfo,
);

userRouter.post(
  "/upload-resume",
  authMiddleware,
  upload.fields([{ name: "Resume" }]),
  UserController.handleResumeUpload
);

userRouter.put(
  "/update-ProfilePic",
  authMiddleware,
  upload.single("profilePic"),
  UserController.handleProfilePicUpdate
);

userRouter.put(
  "/update-banner",
  authMiddleware,
  upload.single("Banner"),
  UserController.handleProfileBannerUpdate
);

userRouter.get("/get-profile", 
  authMiddleware, 
  UserController.getFullProfile
);

userRouter.post(
  "/add-experience",
  authMiddleware,
  upload.fields([{ name: "offerLetter" }, { name: "completionCertificate" }]),
  UserController.addExperience,
);

userRouter.put(
  "update-experience",
  authMiddleware,
  UserController.updateExperience,
);

userRouter.delete(
  "delete-experience",
  authMiddleware,
  UserController.deleteExperience,
);

export default userRouter;
