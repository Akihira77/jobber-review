import {
    getReviewsByGigId,
    getReviewsBySellerId
} from "@review/services/review.service";

describe("Read/Get method", () => {
    describe("getReviewsByGigId method", () => {
        it("Found Reviews of an Gig case", async () => {
            const result = await getReviewsByGigId("65ea7e48d784cc0840f19069");

            expect(result).not.toBeNull();
        });

        it("Empty Reviews of an Gig case", async () => {
            const result = await getReviewsByGigId("123213123123213213213213");

            expect(result).toEqual([]);
        });
    });

    describe("getReviewsBySellerId method", () => {
        it("Found Reviews of Seller case", async () => {
            const result = await getReviewsBySellerId(
                "65e9cc7c1d2eacf8631ba73b"
            );

            expect(result).not.toBeNull();
        });

        it("Empty Reviews of Seller case", async () => {
            const result = await getReviewsBySellerId(
                "123213123123213213213213"
            );

            expect(result).toEqual([]);
        });
    });
});
