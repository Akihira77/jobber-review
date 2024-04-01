import { app } from "@review/app"
import supertest from "supertest"

const serverApp = app;
const reviewApi = "/api/v1/review";

describe("Review controller - Get method", () => {
    describe("reviewsByGigId() method", () => {
        it("Return 200 empty reviews", async () => {
            const {body, statusCode} = await supertest(serverApp).get(`${reviewApi}/gig/65ea7e48d784cc0840f1906`);

            expect(body).toEqual({
                message: "Gig reviews by gig id",
                reviews: []
            });
            expect(statusCode).toEqual(200);
        })

        it("Return 200 and reviews", async () => {
            const {body, statusCode} = await supertest(serverApp).get(`${reviewApi}/gig/65ea7e48d784cc0840f19069`);

            expect(body).toBeTruthy();
            expect(statusCode).toEqual(200);
        })
    })

    describe("reviewsBySellerId() method", () => {
        it("Return 200 empty reviews", async () => {
            const {body, statusCode} = await supertest(serverApp).get(`${reviewApi}/seller/65ea7e48d784cc0840f1906`);

            expect(body).toEqual({
                message: "Gig reviews by seller id",
                reviews: []
            });
            expect(statusCode).toEqual(200);
        })

        it("Return 200 and reviews", async () => {
            const {body, statusCode} = await supertest(serverApp).get(`${reviewApi}/seller/65e9cc7c1d2eacf8631ba73b`);

            expect(body).toBeTruthy();
            expect(statusCode).toEqual(200);
        })
    })
})
