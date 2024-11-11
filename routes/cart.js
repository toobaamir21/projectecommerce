
const express =require( 'express')

const router = express.Router()

const { createCart, getCart } = require('../controllers/cart')


router.post('/create-cart',createCart)
router.get('/get-carts',getCart)

module.exports = router
