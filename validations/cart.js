const Joi = require("joi");

const createCartSchema = Joi.object({
  body: Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required().strict(),
  }),
});

const updateCartItemSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({ id: Joi.string().uuid().required() }),
  body: Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required().strict(),
  }),
});

const deleteCartItemSchema = Joi.object({
  body:Joi.object({ cartItemId: Joi.string().uuid().required()})
 
});

module.exports = {
  createCartSchema,
  updateCartItemSchema,
  deleteCartItemSchema,
};
