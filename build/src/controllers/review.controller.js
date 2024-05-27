"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const config_1 = require("../config");
const review_schema_1 = require("../schemas/review.schema");
const http_status_codes_1 = require("http-status-codes");
class ReviewController {
    constructor(reviewService, rmq) {
        this.reviewService = reviewService;
        this.rmq = rmq;
    }
    addReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = review_schema_1.reviewSchema.validate(req.body);
            if (error === null || error === void 0 ? void 0 : error.details[0]) {
                throw new jobber_shared_1.BadRequestError(error.details[0].message, "ReviewService Create review() method");
            }
            const review = yield this.reviewService.addReview(req.body);
            const messageDetails = {
                gigId: review.gigId,
                reviewerId: review.reviewerId,
                sellerId: review.sellerId,
                review: review.review,
                rating: review.rating,
                orderId: review.orderId,
                createdAt: review.createdAt.toString(),
                type: review.reviewType
            };
            yield this.rmq.publishFanoutMessage(config_1.exchangeNamesAndRoutingKeys.reviewService.review.exchangeName, JSON.stringify({
                type: "addReview",
                messageDetails
            }), "Review details sent to order and users services");
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                message: "Review created successfully",
                review
            });
        });
    }
    findReviewsByGigId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.reviewService.getReviewsByGigId(req.params.gigId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Gig reviews by gig id",
                reviews
            });
        });
    }
    findReviewsBySellerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.reviewService.getReviewsBySellerId(req.params.sellerId);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Gig reviews by seller id",
                reviews
            });
        });
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map