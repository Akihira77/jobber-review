import { IReviewDocument } from "@Akihira77/jobber-shared";
import { app } from "@review/app";
import supertest from "supertest";
import * as reviewService from "@review/services/review.service";

const serverApp = app;
const reviewApi = "/api/v1/review";

describe("Review Controller - Create method", () => {
    it("return 400 and error message", async () => {
        const { body, statusCode } = await supertest(serverApp)
            .post(reviewApi)
            .send({});

        expect(body).toEqual({
            comingFrom: "addReview() method",
            message: "\"gigId\" is required",
            status: "error",
            statusCode: 400
        });
        expect(statusCode).toEqual(400);
    });

    it("return 201 and the correct success response", async () => {
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

        const { body, statusCode } = await supertest(serverApp)
            .post(`${reviewApi}/`)
            .send(data);

        await reviewService.deleteReview(body.review.id);

        expect(body).toEqual({
            message: "Review created successfully",
            review: {
                ...data,
                id: body.review.id,
                createdAt: body.review.createdAt
            }
        });
        expect(statusCode).toEqual(201);
    });
});
