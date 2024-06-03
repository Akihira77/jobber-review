import { IReviewDocument, winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL } from "@review/config";
import { Logger } from "winston";
import { ReviewService } from "../review.service";
import { databaseConnection } from "@review/database";

const logger = (moduleName?: string): Logger =>
    winstonLogger(
        `${ELASTIC_SEARCH_URL}`,
        moduleName ?? "Review Service",
        "debug"
    );

describe("review.service.ts - addReview() method", () => {
    let reviewService: ReviewService;
    let db: any;
    beforeAll(async () => {
        db = await databaseConnection(logger);
        reviewService = new ReviewService(db, logger);
    });

    let id = 0;
    afterAll(async () => {
        await reviewService.deleteReview(id);
        await db.end();
    });

    it("Should successfully added review to database", async () => {
        const data: Omit<IReviewDocument, "createdAt"> = {
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
        const result = await reviewService.addReview(data);
        id = (result as any).id;

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
    });

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
