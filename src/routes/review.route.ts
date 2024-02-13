import express, { Router } from "express";
import * as get from "@review/controllers/get";
import * as create from "@review/controllers/create";

const router = express.Router();

export function reviewRoutes(): Router {
    router.get("/seller/:sellerId", get.reviewsBySellerId);
    router.get("/gig/:gigId", get.reviewsByGigId);

    router.post("/", create.review);

    return router;
}
