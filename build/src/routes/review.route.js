"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
function reviewRoutes(controller) {
    router.get("/seller/:sellerId", controller.findReviewsBySellerId.bind(controller));
    router.get("/gig/:gigId", controller.findReviewsByGigId.bind(controller));
    router.post("/", controller.addReview.bind(controller));
    return router;
}
exports.reviewRoutes = reviewRoutes;
//# sourceMappingURL=review.route.js.map