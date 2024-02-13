import * as reviewService from "@review/services/review.service";
import { Request, Response } from "express";
import {
    authUserPayload,
    reviewDocument,
    reviewMockRequest,
    reviewMockResponse
} from "@review/controllers/test/mocks/review.mock";
import * as create from "@review/controllers/create";

jest.mock("@Akihira77/jobber-shared");
jest.mock("@elastic/elasticsearch");
jest.mock("@review/services/review.service");
jest.mock("@review/queues/connection");

describe("Review Controller", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create method", () => {
        it("Should return the correct response", async () => {
            const req: Request = reviewMockRequest(
                {},
                reviewDocument,
                authUserPayload
            ) as unknown as Request;
            const res: Response = reviewMockResponse();

            jest.spyOn(reviewService, "addReview").mockResolvedValue(
                reviewDocument
            );

            await create.review(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Review created successfully",
                review: reviewDocument
            });
        });
    });
});
