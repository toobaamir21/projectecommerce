const Joi = require("joi");

const signupSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const loginSchema = Joi.object({
  query: Joi.object({}),
  params: Joi.object({}),
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

module.exports = { signupSchema, loginSchema };
