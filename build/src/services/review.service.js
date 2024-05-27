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
exports.ReviewService = void 0;
const jobber_shared_1 = require("@Akihira77/jobber-shared");
class ReviewService {
    constructor(db, logger) {
        this.db = db;
        this.logger = logger;
    }
    addReview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { gigId, rating, orderId, country, review, reviewerId, reviewerImage, reviewerUsername, sellerId, reviewType } = data;
                const createdAtDate = new Date().toISOString();
                const { rows } = yield this.db.query(`
        INSERT INTO "reviews" (
            "gigId", "rating", "orderId", "country", "createdAt", "review", "reviewerId", "reviewerImage", "reviewerUsername", "sellerId", "reviewType"
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11
        )

        RETURNING *;
    `, [
                    gigId,
                    rating,
                    orderId,
                    country,
                    createdAtDate,
                    review,
                    reviewerId,
                    reviewerImage,
                    reviewerUsername,
                    sellerId,
                    reviewType
                ]);
                return rows[0];
            }
            catch (error) {
                if (error instanceof jobber_shared_1.CustomError) {
                    this.logger("services/review.service.ts - addReview()").error(error);
                    throw error;
                }
                throw new Error("Unexpected Error Occured. Please Try Again");
            }
        });
    }
    getReviewsByGigId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield this.db.query(`SELECT * FROM "reviews"
        WHERE "gigId" = $1`, [id]);
                return rows;
            }
            catch (error) {
                this.logger("services/review.service.ts - getReviewsByGigId()").error(error);
                throw new Error("Unexpected Error Occured. Please Try Again");
            }
        });
    }
    getReviewsBySellerId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield this.db.query(`SELECT this.db FROM "reviews"
        WHERE "sellerId" = $1
        AND "reviewType" = $2`, [id, "seller-review"]);
                return rows;
            }
            catch (error) {
                this.logger("services/review.service.ts - getReviewsBySellerId()").error(error);
                throw new Error("Unexpected Error Occured. Please Try Again");
            }
        });
    }
    deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rowCount } = yield this.db.query("DELETE FROM \"reviews\" WHERE id = $1", [reviewId]);
                return rowCount ? rowCount > 0 : false;
            }
            catch (error) {
                this.logger("services/review.service.ts - deleteReview()").error(error);
                throw new Error("Unexpected Error Occured. Please Try Again");
            }
        });
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map