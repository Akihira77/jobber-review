import Joi, { ObjectSchema } from "joi";

export const reviewSchema: ObjectSchema = Joi.object().keys({
    gigId: Joi.string().required(),
    orderId: Joi.string().required(),
    sellerId: Joi.string().required(),
    reviewerId: Joi.string().required(),
    reviewerUsername: Joi.string().required(),
    reviewerImage: Joi.string().required(),
    country: Joi.string().required(),
    rating: Joi.number().required(),
    review: Joi.string().required(),
    reviewType: Joi.string().required(),
    createdAt: Joi.string().optional()
});
