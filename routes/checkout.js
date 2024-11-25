
const express =require( 'express')

const router = express.Router()

const { checkoutSession } = require('../controllers/checkout')
const validate = require('../middleware/validate')
const { createCheckoutSchema } = require('../validations/checkout')
const verifyJWT = require('../middleware/verifyJWT')


router.post('/create-checkout-session',verifyJWT,checkoutSession)


module.exports = router
