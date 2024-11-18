const Joi = require('joi');


const createProductSchema = Joi.object({
  query: Joi.object({}),
  params:Joi.object({}),
  body:Joi.object({productName: Joi.string().min(3).max(50).required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(0).required(),
  product_size: Joi.array().items(Joi.string()).required(),
  product_color: Joi.array().items(Joi.string().min(1)).required(),
})})
  


const updateProductSchema = Joi.object({
  body:Joi.object({productName: Joi.string().min(3).max(50).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().integer().positive().optional(),
  quantity: Joi.number().integer().min(0).optional(),
  product_size: Joi.array().items(Joi.string()).optional(),
  product_color: Joi.array().items(Joi.string().min(1)).optional(),
}).min(1)})

module.exports = { createProductSchema, updateProductSchema };
