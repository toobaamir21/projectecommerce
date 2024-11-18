const Joi = require('joi');

const createOrderSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    total_amount: Joi.number().positive().required(),
    name: Joi.string().min(3).max(100).required(),
    contact: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.string().min(10).max(500).required(),
    paymentmode: Joi.string().valid('COD', 'Card').required(),
    products: Joi.array().items(
      Joi.object({
        product_Id: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    ).required(), 
  }),
});


const updateOrderStatusSchema = Joi.object({
    params: Joi.object({
      id: Joi.string().uuid().required(),
    }),
  
    body: Joi.object({
      status: Joi.string().valid('PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED').required(),
      productId:Joi.string().uuid().required()
    }),
  });

  
const getOrderByOrderId = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  query:Joi.object({}),
  body: Joi.object({}),
});
module.exports = { createOrderSchema,updateOrderStatusSchema,getOrderByOrderId };
