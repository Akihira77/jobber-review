import { addReview } from "@review/services/review.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function review(req: Request, res: Response): Promise<void> {
    const review = await addReview(req.body);

    res.status(StatusCodes.CREATED).json({
        message: "Review created successfully",
        review
    });
}
