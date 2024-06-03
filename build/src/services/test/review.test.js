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
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const config_1 = require("../../config");
const review_service_1 = require("../review.service");
const database_1 = require("../../database");
const logger = (moduleName) => (0, jobber_shared_1.winstonLogger)(`${config_1.ELASTIC_SEARCH_URL}`, moduleName !== null && moduleName !== void 0 ? moduleName : "Review Service", "debug");
describe("review.service.ts - addReview() method", () => {
    let reviewService;
    let db;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = yield (0, database_1.databaseConnection)(logger);
        reviewService = new review_service_1.ReviewService(db, logger);
    }));
    let id = 0;
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield reviewService.deleteReview(id);
        yield db.end();
    }));
    it("Should successfully added review to database", () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            gigId: "664d6353cf0fec9ffb355e33",
            orderId: "JO81090186909",
            sellerId: "6644215d6fdffcf6c3a6d8da",
            reviewerId: "6644207ba5373ac1bd57144a",
            reviewerUsername: "Irritatingbo",
            reviewerImage: "https://picsum.photos/seed/sQFhVl2/640/480",
            country: "Andorra",
            rating: 5,
            review: `Nice work`,
            reviewType: "buyer-review"
        };
        const result = yield reviewService.addReview(data);
        id = result.id;
        expect(result.gigId).toBe(data.gigId);
        expect(result.rating).toBe(data.rating);
        expect(result.orderId).toBe(data.orderId);
        expect(result.country).toBe(data.country);
        expect(result.review).toBe(data.review);
        expect(result.review).toBe(data.review);
        expect(result.reviewerId).toBe(data.reviewerId);
        expect(result.reviewerImage).toBe(data.reviewerImage);
        expect(result.reviewerUsername).toBe(data.reviewerUsername);
        expect(result.sellerId).toBe(data.sellerId);
        expect(result.reviewType).toBe(data.reviewType);
    }));
    // it("Should throw error because not sending gigId", async () => {
    //     await expect(
    //         reviewService.addReview({} as IReviewDocument)
    //     ).rejects.toThrow('"gigId" is required');
    // });
    // it("Should throw error because not sending orderId", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"orderId" is required');
    // });
    // it("Should throw error because not sending sellerId", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"sellerId" is required');
    // })
    // it("Should throw error because not sending reviewerId", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"reviewerId" is required');
    // })
    // it("Should throw error because not sending reviewerUsername", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"reviewerUsername" is required');
    // })
    // it("Should throw error because not sending reviewerImage", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId",
    //             reviewerUsername: "Irritatingbo"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"reviewerImage" is required');
    // })
    // it("Should throw error because not sending country", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId",
    //             reviewerUsername: "Irritatingbo",
    //             reviewerImage: "https://picsum.photos/seed/sQFhVl2/640/480"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"country" is required');
    // })
    // it("Should throw error because not sending rating", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId",
    //             reviewerUsername: "Irritatingbo",
    //             reviewerImage: "https://picsum.photos/seed/sQFhVl2/640/480",
    //             country: "Andorra"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"rating" is required');
    // })
    // it("Should throw error because not sending review", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId",
    //             reviewerUsername: "Irritatingbo",
    //             reviewerImage: "https://picsum.photos/seed/sQFhVl2/640/480",
    //             country: "Andorra",
    //             rating: 5
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"review" is required');
    // })
    // it("Should throw error because not sending reviewType", async () => {
    //     await expect(
    //         reviewService.addReview({
    //             gigId: "664d6353cf0fec9ffb355e33",
    //             orderId: "JO81090186909",
    //             sellerId: "6644215d6fdffcf6c3a6d8da",
    //             reviewerId: "reviewerId",
    //             reviewerUsername: "Irritatingbo",
    //             reviewerImage: "https://picsum.photos/seed/sQFhVl2/640/480",
    //             country: "Andorra",
    //             rating: 5,
    //             review: "Nice work"
    //         } as IReviewDocument)
    //     ).rejects.toThrow('"reviewType" is required');
    // });
});
//# sourceMappingURL=review.test.js.map