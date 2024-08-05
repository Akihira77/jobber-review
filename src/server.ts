import { Context, Hono, Next } from "hono"
import { serve } from "@hono/node-server"
import { compress } from "hono/compress"
import { bodyLimit } from "hono/body-limit"
import { secureHeaders } from "hono/secure-headers"
import { timeout } from "hono/timeout"
import { cors } from "hono/cors"
import { createVerifier } from "fast-jwt"
import { csrf } from "hono/csrf"
import {
    CustomError,
    IAuthPayload,
    winstonLogger
} from "@Akihira77/jobber-shared"
import {
    API_GATEWAY_URL,
    ELASTIC_SEARCH_URL,
    JWT_TOKEN,
    NODE_ENV,
    PORT
} from "@review/config"
import { appRoutes } from "@review/routes"
import { StatusCodes } from "http-status-codes"
import { Pool } from "pg"
import { Logger } from "winston"
import { StatusCode } from "hono/utils/http-status"
import { HTTPException } from "hono/http-exception"
import { logger } from "hono/logger"
import { ElasticSearchClient } from "./elasticsearch"
import { ReviewQueue } from "./queues/review.queue"

const LIMIT_TIMEOUT = 3 * 1000 // 3s

export async function setupHono(
    app: Hono,
    pool: Pool,
    logger?: (location?: string) => Logger
): Promise<Hono> {
    if (!logger) {
        logger = (moduleName?: string) =>
            winstonLogger(
                `${ELASTIC_SEARCH_URL}`,
                moduleName ?? "server.ts",
                "debug"
            )
    }

    const reviewQueue = await startQueues(logger)
    reviewErrorHandler(app)
    securityMiddleware(app)
    standardMiddleware(app)
    routesMiddleware(app, pool, reviewQueue, logger)
    return app
}
export async function start(
    app: Hono,
    pool: Pool,
    logger: (moduleName?: string) => Logger
): Promise<void> {
    startElasticSearch(logger)
    app = await setupHono(app, pool, logger)
    startServer(app, logger)
}

function securityMiddleware(app: Hono): void {
    app.use(secureHeaders())
    app.use(csrf())
    app.use(
        timeout(LIMIT_TIMEOUT, () => {
            return new HTTPException(StatusCodes.REQUEST_TIMEOUT, {
                message: `Request timeout after waiting ${LIMIT_TIMEOUT}ms. Please try again later.`
            })
        })
    )
    app.use(
        cors({
            origin: [`${API_GATEWAY_URL}`],
            credentials: true,
            allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        })
    )

    app.use(async (c: Context, next: Next) => {
        const authorization = c.req.header("authorization")
        if (authorization && authorization !== "") {
            const authBearer = authorization.split(" ")[1]
            const verifier = createVerifier({
                key: `${JWT_TOKEN}`,
                cache: true,
                cacheTTL: 30 * 60 * 1000
            })
            const payload = verifier(authBearer) as IAuthPayload
            c.set("currentUser", payload)
        }

        await next()
    })
}

function standardMiddleware(app: Hono): void {
    if (NODE_ENV !== "production") {
        app.use(logger())
    }
    app.use(compress())
    app.use(
        bodyLimit({
            maxSize: 2 * 100 * 1000 * 1024, // 200mb
            onError(c: Context) {
                return c.text(
                    "Your request is too big",
                    StatusCodes.REQUEST_HEADER_FIELDS_TOO_LARGE
                )
            }
        })
    )

    //    app.use(
    //        rateLimiter({
    //            windowMs: 10 * 60 * 1000, // 600s
    //            limit: 100,
    //            standardHeaders: "draft-6",
    //            keyGenerator: (c: Context) => {
    //                return c.req.url
    //            }
    //        })
    //    )
}

function routesMiddleware(
    app: Hono,
    pool: Pool,
    queue: ReviewQueue,
    logger: (moduleName: string) => Logger
): void {
    appRoutes(app, pool, queue, logger)
}

async function startQueues(
    logger: (moduleName: string) => Logger
): Promise<ReviewQueue> {
    const reviewQueue = new ReviewQueue(null, logger)
    await reviewQueue.createConnection()
    return reviewQueue
}

function startElasticSearch(logger: (moduleName: string) => Logger): void {
    const elasticClient = new ElasticSearchClient(logger)
    elasticClient.checkConnection()
}

function reviewErrorHandler(app: Hono): void {
    app.onError((err: Error, c: Context) => {
        if (err instanceof CustomError) {
            return c.json(
                err.serializeErrors(),
                (err.statusCode as StatusCode) ??
                    StatusCodes.INTERNAL_SERVER_ERROR
            )
        } else if (err instanceof HTTPException) {
            return err.getResponse()
        }

        return c.text(
            "Unexpected error occurred. Please try again",
            StatusCodes.INTERNAL_SERVER_ERROR
        )
    })
}

async function startServer(
    app: Hono,
    logger: (moduleName: string) => Logger
): Promise<void> {
    try {
        logger("server.ts - startServer()").info(
            `ReviewService has started with pid: ${process.pid}`
        )

        serve(
            {
                fetch: app.fetch,
                port: Number(PORT)
            },
            (info: any) => {
                logger("server.ts - startServer()").info(
                    `ReviewService running on port ${info.port}`
                )
            }
        )
    } catch (error) {
        logger("server.ts - startServer()").error(
            "ReviewService startServer() method error:",
            error
        )
    }
}
