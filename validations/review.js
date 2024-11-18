const Joi = require('joi');

const createReviewSchema = Joi.object({
  query:Joi.object({}),
  params:Joi.object({}),
  body:Joi.object({})
})


module.exports = {createReviewSchema};
