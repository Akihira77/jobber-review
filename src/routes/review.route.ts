import express, { Router } from "express";
import * as reviewController from "@review/controllers/review.controller";

const router = express.Router();

export function reviewRoutes(): Router {
    router.get("/seller/:sellerId", reviewController.findReviewsBySellerId);
    router.get("/gig/:gigId", reviewController.findReviewsByGigId);

    router.post("/", reviewController.addReview);

    return router;
}
