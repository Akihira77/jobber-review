import { Application } from "express";
import { healthRoutes } from "@review/routes/health.route";
import { reviewRoutes } from "@review/routes/review.route";

const BASE_PATH = "/api/v1/review";

export function appRoutes(app: Application): void {
    app.use("", healthRoutes());
    app.use(BASE_PATH, reviewRoutes());
}
