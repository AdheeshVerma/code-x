import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import jobListingController from "../controller/job-listing.controller";
const jobListingRouter = Router();

// Org-scoped job listings
jobListingRouter.get("/", authMiddleware, jobListingController.getAllJobListings);

export default jobListingRouter;
