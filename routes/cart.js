
const express =require( 'express')

const router = express.Router()

const { createCart, getCart, updateCartItems, deleteCart, deleteCartItems } = require('../controllers/cart')


router.post('/create-cart',createCart)
router.get('/get-carts',getCart)
router.put('/updateCartItems',updateCartItems)
router.delete('/deleteCart',deleteCart)
router.delete('/deleteCartItems',deleteCartItems)

module.exports = router
