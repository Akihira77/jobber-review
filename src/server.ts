import { Context, Hono, Next } from "hono";
import { serve } from "@hono/node-server";
import { compress } from "hono/compress";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { rateLimiter } from "hono-rate-limiter";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
import jwt from "jsonwebtoken";
import {
    CustomError,
    IAuthPayload,
    NotAuthorizedError
} from "@Akihira77/jobber-shared";
import { API_GATEWAY_URL, JWT_TOKEN, PORT } from "@review/config";
import { appRoutes } from "@review/routes";
import { StatusCodes } from "http-status-codes";
import { Pool } from "pg";
import { Logger } from "winston";

import { ElasticSearchClient } from "./elasticsearch";
import { ReviewQueue } from "./queues/review.queue";
import { StatusCode } from "hono/utils/http-status";
import { HTTPException } from "hono/http-exception";

const LIMIT_TIMEOUT = 2 * 1000; // 2s

export async function start(
    app: Hono,
    pool: Pool,
    logger: (moduleName: string) => Logger
): Promise<void> {
    const reviewQueue = await startQueues(logger);
    startElasticSearch(logger);
    securityMiddleware(app);
    reviewErrorHandler(app);
    standardMiddleware(app);
    routesMiddleware(app, pool, reviewQueue, logger);
    startServer(app, logger);
}

function securityMiddleware(app: Hono): void {
    app.use(secureHeaders());
    app.use(csrf());
    app.use(
        timeout(LIMIT_TIMEOUT, () => {
            return new HTTPException(StatusCodes.REQUEST_TIMEOUT, {
                message: `Request timeout after waiting ${LIMIT_TIMEOUT}ms. Please try again later.`
            });
        })
    );
    app.use(
        cors({
            origin: [`${API_GATEWAY_URL}`],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        })
    );

    app.use(async (c: Context, next: Next) => {
        if (c.req.path == "/review-health") {
            await next();
            return;
        }

        const authorization = c.req.header("authorization");
        if (!authorization || authorization === "") {
            throw new NotAuthorizedError(
                "unauthenticated request",
                "Review Service"
            );
        }

        const token = authorization.split(" ")[1];
        const payload = jwt.verify(token, JWT_TOKEN!) as IAuthPayload;

        c.set("currentUser", payload);
        await next();
    });
}

function standardMiddleware(app: Hono): void {
    app.use(compress());
    app.use(
        bodyLimit({
            maxSize: 2 * 100 * 1000 * 1024, // 200mb
            onError(c: Context) {
                return c.text(
                    "Your request is too big",
                    StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
                );
            }
        })
    );

    const generateRandomNumber = (length: number): number => {
        return (
            Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) +
            Math.pow(10, length - 1)
        );
    };

    app.use(
        rateLimiter({
            windowMs: 1 * 60 * 1000, //60s
            limit: 5,
            standardHeaders: "draft-6",
            keyGenerator: () => generateRandomNumber(12).toString()
        })
    );
}

function routesMiddleware(
    app: Hono,
    pool: Pool,
    queue: ReviewQueue,
    logger: (moduleName: string) => Logger
): void {
    appRoutes(app, pool, queue, logger);
}

async function startQueues(
    logger: (moduleName: string) => Logger
): Promise<ReviewQueue> {
    const reviewQueue = new ReviewQueue(null, logger);
    await reviewQueue.createConnection();
    return reviewQueue;
}

function startElasticSearch(logger: (moduleName: string) => Logger): void {
    const elasticClient = new ElasticSearchClient(logger);
    elasticClient.checkConnection();
}

function reviewErrorHandler(app: Hono): void {
    app.onError((err: Error, c: Context) => {
        if (err instanceof CustomError) {
            return c.json(
                err.serializeErrors(),
                (err.statusCode as StatusCode) ??
                    StatusCodes.INTERNAL_SERVER_ERROR
            );
        } else if (err instanceof HTTPException) {
            return err.getResponse();
        }

        return c.text(
            "Unexpected erorr occured. Please try again",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    });
}

async function startServer(
    app: Hono,
    logger: (moduleName: string) => Logger
): Promise<void> {
    try {
        logger("server.ts - startServer()").info(
            `ReviewService has started with pid: ${process.pid}`
        );

        serve(
            {
                fetch: app.fetch,
                port: Number(PORT)
            },
            (info: any) => {
                logger("server.ts - startServer()").info(
                    `ReviewService running on port ${info.port}`
                );
            }
        );
    } catch (error) {
        logger("server.ts - startServer()").error(
            "ReviewService startServer() method error:",
            error
        );
    }
}
