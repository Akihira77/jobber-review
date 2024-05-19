import { IReviewDocument } from "@Akihira77/jobber-shared";
import { addReview, deleteReview } from "@review/services/review.service";

describe("Create method", () => {
    const data: IReviewDocument = {
        gigId: "65ea7e48d784cc0840f19069",
        rating: 5,
        orderId: "JO81090186909",
        country: "Andorra",
        review: `awdaddddddddddddddadaw adwaddddddddddddddddddddd
    awdaaaaaaaaaaawdaw awdaaaaaaaaaaaaaaaaaa
    awdaddddddddd
    awdaawd`,
        reviewerId: "65e9cc7c1d2eacf8631ba73b",
        reviewerImage:
            "https://res.cloudinary.com/duthytmqy/image/upload/v1709731388/92b5de69-ae5d-4afc-a656-767e8a6cc112.jpg",
        reviewerUsername: "Kasandra",
        sellerId: "65e9cc7c1d2eacf8631ba73b",
        reviewType: "seller-review",
        createdAt: new Date().toISOString()
    };

    it("Success case", async () => {
        const result = await addReview(data);
        await deleteReview((result as any).id);

        expect(result).toEqual({
            ...data,
            id: (result as any).id,
            createdAt: result.createdAt
        });
    });

    it("Failed case - all empty", async () => {
        await expect(addReview({} as IReviewDocument)).rejects.toThrow(
            "\"gigId\" is required"
        );
    });
});
