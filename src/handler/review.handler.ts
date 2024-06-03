import {
    BadRequestError,
    IReviewDocument,
    IReviewMessageDetails
} from "@Akihira77/jobber-shared";
import { exchangeNamesAndRoutingKeys } from "@review/config";
import { ReviewQueue } from "@review/queues/review.queue";
import { reviewSchema } from "@review/schemas/review.schema";
import { ReviewService } from "@review/services/review.service";

export class ReviewHandler {
    constructor(
        private reviewService: ReviewService,
        private rmq: ReviewQueue
    ) {}

    async addReview(reqBody: any): Promise<IReviewDocument> {
        const { error, value } = reviewSchema.validate(reqBody);
        if (error?.details[0]) {
            throw new BadRequestError(
                error.details[0].message,
                "ReviewService Create review() method"
            );
        }

        const review = await this.reviewService.addReview(value);

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

        await this.rmq.publishFanoutMessage(
            exchangeNamesAndRoutingKeys.reviewService.review.exchangeName,
            JSON.stringify({
                type: "addReview",
                messageDetails
            }),
            "Review details sent to order and users services"
        );

        return review;
    }

    async findReviewsByGigId(gigId: string): Promise<IReviewDocument[]> {
        const reviews = await this.reviewService.getReviewsByGigId(gigId);

        return reviews;
    }

    async findReviewsBySellerId(sellerId: string): Promise<IReviewDocument[]> {
        const reviews = await this.reviewService.getReviewsBySellerId(sellerId);

        return reviews;
    }
}
