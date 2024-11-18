
const express =require( 'express')

const router = express.Router()

const { createCart, getCart, updateCartItems, deleteCart, deleteCartItems } = require('../controllers/cart')
const validate = require('../middleware/validate')
const { createCartSchema, updateCartItemSchema, deleteCartItemSchema } = require('../validations/cart')
const verifyJWT = require('../middleware/verifyJWT')


router.post('/create-cart',verifyJWT,validate(createCartSchema) ,createCart)
router.get('/get-carts',verifyJWT,getCart)
router.delete('/deleteCart',verifyJWT,deleteCart)
router.put('/updateCartItems/:id',verifyJWT,validate(updateCartItemSchema), updateCartItems)
router.delete('/deleteCartItems',verifyJWT,validate(deleteCartItemSchema), deleteCartItems)

module.exports = router
