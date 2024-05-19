import {
    BadRequestError,
    IReviewMessageDetails
} from "@Akihira77/jobber-shared";
import { exchangeNamesAndRoutingKeys } from "@review/config";
import { publishFanoutMessage } from "@review/queues/review.producer";
import { reviewSchema } from "@review/schemas/review.schema";
import { reviewChannel } from "@review/server";
import * as reviewService from "@review/services/review.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export async function addReview(req: Request, res: Response): Promise<void> {
    const { error } = reviewSchema.validate(req.body);
    if (error?.details[0]) {
        throw new BadRequestError(
            error.details[0].message,
            "ReviewService Create review() method"
        );
    }

    const review = await reviewService.addReview(req.body);

    const messageDetails: IReviewMessageDetails = {
        gigId: review.gigId,
        reviewerId: review.reviewerId,
        sellerId: review.sellerId,
        review: review.review,
        rating: review.rating,
        orderId: review.orderId,
        createdAt: review.createdAt.toString(),
        type: review.reviewType!
    };

    await publishFanoutMessage(
        reviewChannel,
        exchangeNamesAndRoutingKeys.reviewService.review.exchangeName,
        JSON.stringify({
            type: "addReview",
            messageDetails
        }),
        "Review details sent to order and users services"
    );

    res.status(StatusCodes.CREATED).json({
        message: "Review created successfully",
        review
    });
}

export async function findReviewsByGigId(
    req: Request,
    res: Response
): Promise<void> {
    const reviews = await reviewService.getReviewsByGigId(req.params.gigId);

    res.status(StatusCodes.OK).json({
        message: "Gig reviews by gig id",
        reviews
    });
}

export async function findReviewsBySellerId(
    req: Request,
    res: Response
): Promise<void> {
    const reviews = await reviewService.getReviewsBySellerId(
        req.params.sellerId
    );

    res.status(StatusCodes.OK).json({
        message: "Gig reviews by seller id",
        reviews
    });
}
