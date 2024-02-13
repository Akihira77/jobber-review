import {
    getReviewsByGigId,
    getReviewsBySellerId
} from "@review/services/review.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function reviewsByGigId(
    req: Request,
    res: Response
): Promise<void> {
    const reviews = await getReviewsByGigId(req.params.gigId);

    res.status(StatusCodes.OK).json({
        message: "Gig reviews by gig id",
        reviews
    });
}

export async function reviewsBySellerId(
    req: Request,
    res: Response
): Promise<void> {
    const reviews = await getReviewsBySellerId(req.params.sellerId);

    res.status(StatusCodes.OK).json({
        message: "Gig reviews by seller id",
        reviews
    });
}
