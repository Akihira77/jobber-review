"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoutes = void 0;
const health_route_1 = require("./routes/health.route");
const review_route_1 = require("./routes/review.route");
// import { verifyGatewayRequest } from "@Akihira77/jobber-shared";
const review_controller_1 = require("./controllers/review.controller");
const review_service_1 = require("./services/review.service");
const BASE_PATH = "/api/v1/review";
function appRoutes(app, db, queue, logger) {
    const reviewService = new review_service_1.ReviewService(db, logger);
    const reviewController = new review_controller_1.ReviewController(reviewService, queue);
    app.use("", (0, health_route_1.healthRoutes)());
    // app.use(BASE_PATH, verifyGatewayRequest, reviewRoutes(reviewController));
    app.use(BASE_PATH, (0, review_route_1.reviewRoutes)(reviewController));
}
exports.appRoutes = appRoutes;
//# sourceMappingURL=routes.js.map