import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
import type {
  UpdateUser,
  createExperience,
  updateExperience,
  updateUserLinks,
} from "../utils/type";
import cloudinaryService from "../service/Cloudinary.service";

class UserController {
  async updateUserInfo(req: Request, res: Response) {
    try {
      const data = req.body as UpdateUser;
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User Id is required");
      }

      // Check for existing user
      const dbUser = await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!dbUser) throw new Error("Db user not found");

      // Update data using trimmed values
      const updatedUser = await prismaClient.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          name: (data.name?.trim() || undefined) ?? dbUser.name,
          userInfo: (data.userInfo?.trim() || undefined) ?? dbUser.userInfo,
          headline: (data.headline?.trim() || undefined) ?? dbUser.headline,
        },
      });
      if (!updatedUser) throw new Error("Failed User Updation");

      return res
        .status(200)
        .json(apiResponse(200, "User data updated", updatedUser));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeUpload(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;

      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-resume-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "Resume",
        uniqueFileName,
      );

      if (!fileLink) throw new Error("Upload failed");

      const updateResume = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          resume: fileLink,
        },
      });
      // TODO: handle resume parsing
      if (!updateResume) throw new Error("Unable to update Resume");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Resume", updateResume));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleResumeDelete(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        select: { resume: true },
      });

      if (!user?.resume) {
        return res
          .status(400)
          .json(apiResponse(400, "No resume to delete", null));
      }

      await cloudinaryService.deleteFile(user.resume);
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: { resume: null },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Resume deleted successfully", updatedUser));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfilePicUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;
      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-Profile-Picture-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "ProfilePic",
        uniqueFileName,
      );
      if (!fileLink) throw new Error("Upload failed");

      const updatedProfilePic = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          profileUrl: fileLink,
        },
      });

      if (!updatedProfilePic)
        throw new Error("Unable to  update profile picture");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Profile Picture", updatedProfilePic));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async handleProfileBannerUpdate(req: Request, res: Response) {
    try {
      const file = req.file;
      if (!file) throw new Error("No file found");
      const userId = req.user?.id;
      if (!userId) throw new Error("User id not found");

      const uniqueFileName = `${file.originalname}-Banner-${Date.now()}`;
      const fileLink = await cloudinaryService.uploadFile(
        file,
        "Profile-Banner",
        uniqueFileName,
      );

      if (!fileLink) throw new Error("Upload failed");

      const updatedBanner = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          bannerUrl: fileLink,
        },
      });

      if (!updatedBanner) throw new Error("Unable to update Banner");

      return res
        .status(200)
        .json(apiResponse(200, "Updated Banner", updatedBanner));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getFullProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error("User id is required");

      // TODO: joins left for complete info
      const userData = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          userExperiences: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!userData) throw new Error("Unable to fetch user data");

      return res
        .status(200)
        .json(apiResponse(200, "User data found", userData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async addExperience(req: Request, res: Response) {
    try {
      const data = req.body as createExperience;
      const userId = req.user?.id;

      if (!userId) throw new Error("User is required");

      const companyName =
        typeof data.companyName === "string" ? data.companyName.trim() : "";
      const jobTitle =
        typeof data.jobTitle === "string" ? data.jobTitle.trim() : "";
      const jobDescription =
        typeof data.jobDescription === "string"
          ? data.jobDescription.trim()
          : "";

      const VALID_JOB_TYPES = [
        "REMOTE",
        "OFFLINE",
        "HYBRID",
        "FREELANCE",
      ] as const;

      if (!VALID_JOB_TYPES.includes(data.jobType as any)) {
        throw new Error("Invalid job type");
      }

      if (
        !companyName ||
        !jobTitle ||
        !jobDescription ||
        !data.startDate ||
        (data.isOngoing !== "ONGOING" && data.isOngoing !== "COMPLETED")
      ) {
        throw new Error("All required fields must be provided");
      }

      const dbUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!dbUser) throw new Error("User not found");

      const createdExperience = await prismaClient.userExperience.create({
        data: {
          companyName,
          jobTitle,
          jobDescription,
          startDate: new Date(data.startDate),
          endDate:
            data.isOngoing === "ONGOING"
              ? null
              : data.endDate
                ? new Date(data.endDate)
                : null,
          isOngoing: data.isOngoing,
          jobType: data.jobType,
          userId: dbUser.id,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Experience Created", createdExperience));
    } catch (error: any) {
      console.error(error);
      return res.status(400).json(apiResponse(400, error.message, null));
    }
  }
  async updateExperience(req: Request, res: Response) {
    try {
      const data = req.body as updateExperience;
      const userId = req.user?.id;

      if (!userId) throw new Error("User Id is required");

      const companyName =
        typeof data.companyName === "string"
          ? data.companyName.trim()
          : undefined;
      const jobTitle =
        typeof data.jobTitle === "string" ? data.jobTitle.trim() : undefined;
      const jobDescription =
        typeof data.jobDescription === "string"
          ? data.jobDescription.trim()
          : undefined;
      const jobType =
        typeof data.jobType === "string" ? data.jobType.trim() : undefined;

      if (
        !companyName &&
        !jobTitle &&
        !jobDescription &&
        !data.startDate &&
        !data.endDate &&
        !jobType
      ) {
        throw new Error("At least one field is required");
      }

      const dbExperience = await prismaClient.userExperience.findFirst({
        where: {
          userId: userId,
        },
      });

      if (!dbExperience) throw new Error("Db user experience not found");

      const updatedExperience = await prismaClient.userExperience.update({
        where: {
          id: dbExperience.id,
        },
        data: {
          companyName: companyName ?? dbExperience.companyName,
          jobTitle: jobTitle ?? dbExperience.jobTitle,
          jobDescription: jobDescription ?? dbExperience.jobDescription,
          startDate: data.startDate ?? dbExperience.startDate,
          endDate: data.endDate ?? dbExperience.endDate,
          isOngoing: data.isOngoing ?? dbExperience.isOngoing,
          jobType: data.jobType ?? dbExperience.jobType,
        },
      });

      if (!updatedExperience) throw new Error("Failed Experience Updation");

      return res
        .status(200)
        .json(apiResponse(200, "Experience updated", updatedExperience));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteExperience(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const experienceId = req.params.experienceId as string;

      if (!userId) {
        return res.status(401).json(apiResponse(401, "Unauthorized", null));
      }

      if (!experienceId) {
        return res
          .status(400)
          .json(apiResponse(400, "Experience ID is required", null));
      }

      const dbExperience = await prismaClient.userExperience.findFirst({
        where: {
          id: experienceId,
          userId: userId, // 🔐 ownership check
        },
      });

      if (!dbExperience) {
        return res
          .status(404)
          .json(apiResponse(404, "Experience not found", null));
      }

      await prismaClient.userExperience.delete({
        where: {
          id: experienceId,
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "Experience deleted successfully", null));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }
  async updateUserPlatformLinks(req: Request, res: Response) {
    try {
      const data = req.body as updateUserLinks;
      const userId = req.user?.id;

      if (!userId) throw new Error("User Id is required");

      if (
        !data.codeForcesUrl &&
        !data.githubUrl &&
        !data.leetcodeUrl &&
        !data.linkedinUrl &&
        data.mediumUrl &&
        data.portfolioUrl
      ) {
        throw new Error("At least one field is required");
      }

      const dbUser = await prismaClient.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!dbUser) throw new Error("No User Found in Db");

      const updatedPlatformLinks = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          githubUrl: data.githubUrl ?? dbUser.githubUrl,
          linkedinUrl: data.linkedinUrl ?? dbUser.linkedinUrl,
          leetcodeUrl: data.leetcodeUrl ?? dbUser.leetcodeUrl,
          codeForcesUrl: data.codeForcesUrl ?? dbUser.codeForcesUrl,
          mediumUrl: data.mediumUrl ?? dbUser.mediumUrl,
          portfolioUrl: data.portfolioUrl ?? dbUser.portfolioUrl,
        },
      });

      if (!updatedPlatformLinks) throw new Error("Unable to update Links");

      return res
        .status(200)
        .json(apiResponse(200, "Platform Links updated", updatedPlatformLinks));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}

export default new UserController();
