import {
    BadRequestError,
    IReviewDocument,
} from "@Akihira77/jobber-shared";
import { pool } from "@review/database";
import { reviewSchema } from "@review/schemas/review.schema";

export async function addReview(
    data: IReviewDocument
): Promise<IReviewDocument> {
    try {
        const { error } = reviewSchema.validate(data);

        if (error?.details) {
            throw new BadRequestError(
                error.details[0].message,
                "addReview() method"
            );
        }

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

        return rows[0];
    } catch (error) {
        if (error) {
            throw error;
        }

        throw new Error("Unexpected Error Occured. Please Try Again");
    }
}

export async function getReviewsByGigId(
    id: string
): Promise<IReviewDocument[]> {
    try {
        const { rows } = await pool.query<IReviewDocument>(
            `SELECT * FROM "reviews"
        WHERE "gigId" = $1`,
            [id]
        );

        return rows;
    } catch (error) {
        if (error) {
            throw error;
        }

        throw new Error("Unexpected Error Occured. Please Try Again");
    }
}

export async function getReviewsBySellerId(
    id: string
): Promise<IReviewDocument[]> {
    try {
        const { rows } = await pool.query<IReviewDocument>(
            `SELECT * FROM "reviews"
        WHERE "sellerId" = $1
        AND "reviewType" = $2`,
            [id, "seller-review"]
        );

        return rows;
    } catch (error) {
        if (error) {
            throw error;
        }

        throw new Error("Unexpected Error Occured. Please Try Again");
    }
}

export async function deleteReview(reviewId: number): Promise<boolean> {
    try {
        const { rowCount } = await pool.query(
            `DELETE FROM "reviews" WHERE id = $1`,
            [reviewId]
        );

        return rowCount ? rowCount > 0 : false;
    } catch (error) {
        if (error) {
            throw error;
        }

        throw new Error("Unexpected Error Occured. Please Try Again");
    }
}
