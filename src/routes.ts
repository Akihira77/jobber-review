import { ReviewHandler } from "@review/handler/review.handler"
import { Logger } from "winston"
import { ReviewService } from "@review/services/review.service"
import { Pool } from "pg"
import { ReviewQueue } from "@review/queues/review.queue"
import { Context, Hono, Next } from "hono"
import { StatusCodes } from "http-status-codes"
import { NotAuthorizedError } from "@Akihira77/jobber-shared"
import { createVerifier } from "fast-jwt"
import { prometheus } from "@hono/prometheus"
import { GATEWAY_JWT_TOKEN } from "./config"

// const BASE_PATH = "/api/v1/review";
const BASE_PATH = "review"

const { printMetrics, registerMetrics } = prometheus()

function metricRoutes(app: Hono) {
    app.use(registerMetrics)
    app.get("/metrics", printMetrics)
}

export function appRoutes(
    app: Hono,
    pool: Pool,
    queue: ReviewQueue,
    logger: (moduleName: string) => Logger
): void {
    metricRoutes(app)

    app.get("review-health", (c: Context) => {
        return c.text("Review service is healthy and OK.", StatusCodes.OK)
    })

    const reviewSvc = new ReviewService(pool, logger)
    const reviewHndlr = new ReviewHandler(reviewSvc, queue)
    const api = app.basePath(BASE_PATH)
    api.use(verifyGatewayRequest, authOnly)

    api.get("/seller/:sellerId", async (c: Context) => {
        try {
            const sellerId = c.req.param("sellerId")
            const reviews = await reviewHndlr.findReviewsBySellerId(sellerId)

            return c.json(
                {
                    message: "Gig reviews by seller id",
                    reviews
                },
                StatusCodes.OK
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    })

    api.get("/gig/:gigId", async (c: Context) => {
        try {
            const gigId = c.req.param("gigId")
            const reviews = await reviewHndlr.findReviewsByGigId(gigId)

            return c.json(
                {
                    message: "Gig reviews by gig id",
                    reviews
                },
                StatusCodes.OK
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    })

    api.post("/", async (c: Context) => {
        try {
            const jsonBody = await c.req.json()
            const review = await reviewHndlr.addReview(jsonBody)

            return c.json(
                {
                    message: "Review created successfully",
                    review
                },
                StatusCodes.OK
            )
        } catch (error) {
            console.log(error)
            throw error
        }
    })

    // api.use(verifyGatewayRequest);
}

async function verifyGatewayRequest(c: Context, next: Next): Promise<void> {
    const token = c.req.header("gatewayToken")
    if (!token) {
        throw new NotAuthorizedError(
            "Invalid request",
            "verifyGatewayRequest() method: Request not coming from api gateway"
        )
    }

    try {
        const verifier = createVerifier({
            key: `${GATEWAY_JWT_TOKEN}`,
            cache: true,
            cacheTTL: 24 * 60 * 60 * 1000, // 24 hours,
            maxAge: 24 * 60 * 60 * 1000
        })
        const payload: { id: string; iat: number } = verifier(token)

        c.set("gatewayToken", payload)
        await next()
    } catch (error) {
        c.text("User cannot access the resource.", StatusCodes.FORBIDDEN)
        return
    }
}

async function authOnly(c: Context, next: Next): Promise<void> {
    const currUser = c.get("currentUser")
    if (currUser && Object.keys(currUser).length > 0) {
        return await next()
    }

    throw new NotAuthorizedError(
        "User is not authenticated. Please signin first.",
        "routes.ts - authOnly() method"
    )
}
