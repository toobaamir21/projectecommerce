const express = require('express');
const { createUser, login } = require('../controllers/user');


const { signupSchema, loginSchema } = require('../validations/user');
const validate = require('../middleware/validate');

const router = express.Router();


router.post('/signup', validate(signupSchema), createUser);
router.post('/login', validate(loginSchema), login);

module.exports = router;
