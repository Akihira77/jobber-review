"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.reviewSchema = joi_1.default.object().keys({
    gigId: joi_1.default.string().required(),
    rating: joi_1.default.number().required(),
    orderId: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    createdAt: joi_1.default.string().required(),
    review: joi_1.default.string().required(),
    reviewerId: joi_1.default.string().required(),
    reviewerImage: joi_1.default.string().required(),
    reviewerUsername: joi_1.default.string().required(),
    sellerId: joi_1.default.string().required(),
    reviewType: joi_1.default.string().required()
});
//# sourceMappingURL=review.schema.js.map