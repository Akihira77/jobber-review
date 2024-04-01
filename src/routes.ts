import { Application } from "express";
import { healthRoutes } from "@review/routes/health.route";
import { reviewRoutes } from "@review/routes/review.route";
// import { verifyGatewayRequest } from "@Akihira77/jobber-shared";

const BASE_PATH = "/api/v1/review";

export function appRoutes(app: Application): void {
    app.use("", healthRoutes());
    // app.use(BASE_PATH, verifyGatewayRequest, reviewRoutes());
    app.use(BASE_PATH, reviewRoutes());
}
