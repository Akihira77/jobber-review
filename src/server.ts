import http from "http";
import "express-async-errors";

import compression from "compression";
import jwt from "jsonwebtoken";
import {
    CustomError,
    IAuthPayload,
    IErrorResponse
} from "@Akihira77/jobber-shared";
import { API_GATEWAY_URL, JWT_TOKEN, NODE_ENV, PORT } from "@review/config";
import {
    Application,
    NextFunction,
    Request,
    Response,
    json,
    urlencoded
} from "express";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
// import { checkConnection } from "@review/elasticsearch";
import { appRoutes } from "@review/routes";
import { createConnection } from "@review/queues/connection";
import { Channel } from "amqplib";
import { StatusCodes } from "http-status-codes";

export let reviewChannel: Channel;

export function start(app: Application): void {
    securityMiddleware(app);
    standardMiddleware(app);
    routesMiddleware(app);
    startQueues();
    // startElasticSearch();
    reviewErrorHandler(app);
    startServer(app);
}

function securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    app.use(hpp());
    app.use(helmet());
    app.use(
        cors({
            origin: [`${API_GATEWAY_URL}`],
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        })
    );

    app.use((req: Request, _res: Response, next: NextFunction) => {
        // console.log(req.headers);
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(token, JWT_TOKEN!) as IAuthPayload;

            req.currentUser = payload;
        }
        next();
    });
}

function standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "200mb" }));
    app.use(urlencoded({ extended: true, limit: "200mb" }));
}

function routesMiddleware(app: Application): void {
    appRoutes(app);
}

async function startQueues(): Promise<void> {
    reviewChannel = (await createConnection()) as Channel;
}

// function startElasticSearch(): void {
//     checkConnection();
// }

function reviewErrorHandler(app: Application): void {
    app.use(
        (
            error: IErrorResponse,
            _req: Request,
            res: Response,
            next: NextFunction
        ) => {
            if (error instanceof CustomError) {
                res.status(
                    error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR
                ).json({
                    message:
                        error?.message ??
                        "Unexpected Error Occured. Please Try Again"
                });
            }

            next();
        }
    );
}

async function startServer(app: Application): Promise<void> {
    try {
        const httpServer: http.Server = new http.Server(app);

        if (NODE_ENV !== "test") {
            httpServer.listen(Number(PORT), () => {
                console.log(`Review server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
}
