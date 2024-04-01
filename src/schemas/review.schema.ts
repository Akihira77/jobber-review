import j, { ObjectSchema } from "joi";

export const reviewSchema: ObjectSchema = j.object().keys({
    gigId: j.string().required(),
    rating: j.number().required(),
    orderId: j.string().required(),
    country: j.string().required(),
    createdAt: j.string().required(),
    review: j.string().required(),
    reviewerId: j.string().required(),
    reviewerImage: j.string().required(),
    reviewerUsername: j.string().required(),
    sellerId: j.string().required(),
    reviewType: j.string().required()
});
