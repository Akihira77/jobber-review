import {
    BadRequestError,
    IReviewDocument,
    IReviewMessageDetails,
    winstonLogger
} from "@Akihira77/jobber-shared";
import {
    ELASTIC_SEARCH_URL,
    exchangeNamesAndRoutingKeys
} from "@review/config";
import { pool } from "@review/database";
import { publishFanoutMessage } from "@review/queues/review.producer";
import { reviewChannel } from "@review/server";
import { Logger } from "winston";

const logger: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    "reviewService",
    "debug"
);

export async function addReview(
    data: IReviewDocument
): Promise<IReviewDocument> {
    try {
        const {
            gigId,
            rating,
            orderId,
            country,
            review,
            reviewerId,
            reviewerImage,
            reviewerUsername,
            sellerId,
            reviewType
        } = data;

        const createdAtDate = new Date().toISOString();

        const { rows } = await pool.query<IReviewDocument>(
            `
        INSERT INTO "reviews" (
            "gigId", "rating", "orderId", "country", "createdAt", "review", "reviewerId", "reviewerImage", "reviewerUsername", "sellerId", "reviewType"
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
        )

        RETURNING *;
    `,
            [
                gigId,
                rating,
                orderId,
                country,
                createdAtDate,
                review,
                reviewerId,
                reviewerImage,
                reviewerUsername,
                sellerId,
                reviewType
            ]
        );

        const mesageDetails: IReviewMessageDetails = {
            gigId,
            reviewerId,
            sellerId,
            review,
            rating,
            orderId,
            createdAt: `${createdAtDate}`,
            type: `${reviewType}`
        };
        const { reviewService } = exchangeNamesAndRoutingKeys;

        await publishFanoutMessage(
            reviewChannel,
            reviewService.review.exchangeName,
            JSON.stringify(mesageDetails),
            "Review details sent to order and users services"
        );

        return rows[0];
    } catch (error) {
        logger.error(`ReviewService addReview() method error:`, error);
        throw new BadRequestError("Unexpected Error Occured. Please Try Again", "reviewService addReview()");
    }
}

export async function getReviewsByGigId(
    id: string
): Promise<IReviewDocument[]> {
    const { rows } = await pool.query<IReviewDocument>(
        `SELECT * FROM "reviews"
        WHERE "gigId" = $1`,
        [id]
    );

    return rows;
}

export async function getReviewsBySellerId(
    id: string
): Promise<IReviewDocument[]> {
    const { rows } = await pool.query<IReviewDocument>(
        `SELECT * FROM "reviews"
        WHERE "sellerId" = $1
        AND "reviewType" = $2`,
        [id, "seller-review"]
    );

    return rows;
}
