import { IReviewMessageDetails } from "@Akihira77/jobber-shared";
import { exchangeNamesAndRoutingKeys } from "@review/config";
import { publishFanoutMessage } from "@review/queues/review.producer";
import { reviewChannel } from "@review/server";
import { addReview } from "@review/services/review.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function review(req: Request, res: Response): Promise<void> {
    const review = await addReview(req.body);

    const mesageDetails: IReviewMessageDetails = {
        gigId: review.gigId,
        reviewerId: review.reviewerId,
        sellerId: review.sellerId,
        review: review.review,
        rating: review.rating,
        orderId: review.orderId,
        createdAt: review.createdAt.toString(),
        type: review.reviewType!
    };
    const { reviewService } = exchangeNamesAndRoutingKeys;

    publishFanoutMessage(
        reviewChannel,
        reviewService.review.exchangeName,
        JSON.stringify(mesageDetails),
        "Review details sent to order and users services"
    );

    res.status(StatusCodes.CREATED).json({
        message: "Review created successfully",
        review
    });
}
