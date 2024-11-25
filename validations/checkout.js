const Joi = require("joi");

const createCheckoutSchema = Joi.object({
  params: Joi.object({}),
  query: Joi.object({}),
  body: Joi.object({
    id: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required().strict(),
  }),
});

module.exports = {
  createCheckoutSchema,
};
