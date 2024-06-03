import { ReviewHandler } from "@review/handler/review.handler";
import { Logger } from "winston";
import { ReviewService } from "@review/services/review.service";
import { Pool } from "pg";
import { ReviewQueue } from "@review/queues/review.queue";
import { Context, Hono, Next } from "hono";
import { StatusCodes } from "http-status-codes";
import { NotAuthorizedError } from "@Akihira77/jobber-shared";
import jwt from "jsonwebtoken";
import { GATEWAY_JWT_TOKEN } from "./config";

const BASE_PATH = "/api/v1/review";

export function appRoutes(
    app: Hono,
    pool: Pool,
    queue: ReviewQueue,
    logger: (moduleName: string) => Logger
): void {
    app.get("review-health", (c: Context) => {
        return c.text("Review service is healthy and OK.", StatusCodes.OK);
    });

    const reviewSvc = new ReviewService(pool, logger);
    const reviewHndlr = new ReviewHandler(reviewSvc, queue);
    const api = app.basePath(BASE_PATH);
    api.use(verifyGatewayRequest);

    api.get("/seller/:sellerId", async (c: Context) => {
        try {
            const sellerId = c.req.param("sellerId");
            const reviews = await reviewHndlr.findReviewsBySellerId(sellerId);

            return c.json(
                {
                    message: "Gig reviews by seller id",
                    reviews
                },
                StatusCodes.OK
            );
        } catch (error) {
            throw error;
        }
    });

    api.get("/gig/:gigId", async (c: Context) => {
        try {
            const gigId = c.req.param("gigId");
            const reviews = await reviewHndlr.findReviewsByGigId(gigId);

            return c.json(
                {
                    message: "Gig reviews by gig id",
                    reviews
                },
                StatusCodes.OK
            );
        } catch (error) {
            throw error;
        }
    });

    api.post("/", async (c: Context) => {
        try {
            const jsonBody = await c.req.json();
            const review = await reviewHndlr.addReview(jsonBody);

            return c.json(
                {
                    message: "Review created successfully",
                    review
                },
                StatusCodes.OK
            );
        } catch (error) {
            throw error;
        }
    });
}

async function verifyGatewayRequest(c: Context, next: Next): Promise<void> {
    const token = c.req.header("gatewayToken");
    if (!token) {
        throw new NotAuthorizedError(
            "Invalid request",
            "verifyGatewayRequest() method: Request not coming from api gateway"
        );
    }

    try {
        const payload: { id: string; iat: number } = jwt.verify(
            token,
            GATEWAY_JWT_TOKEN!
        ) as {
            id: string;
            iat: number;
        };

        c.set("gatewayToken", payload);
        await next();
    } catch (error) {
        throw new NotAuthorizedError(
            "Invalid request",
            "verifyGatewayRequest() method: Request not coming from api gateway"
        );
    }
}
