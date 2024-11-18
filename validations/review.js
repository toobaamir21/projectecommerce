const Joi = require('joi');

const createReviewSchema = Joi.object({
  query:Joi.object({}),
  params:Joi.object({}),
  body:Joi.object({
    comment: Joi.string().min(3).max(30).required(),
    productId: Joi.string().uuid().required(),
    orderItemId: Joi.string().uuid().required(),
  })
})


module.exports = {createReviewSchema};
