
const express =require( 'express')

const router = express.Router()

const { createCart, getCart } = require('../controllers/cart')


router.post('/create-cart',createCart)
router.get('/get-carts',getCart)
// router.get('/productById/:id',getProductById)
// router.put('/updateProduct/:id',updateProduct)
module.exports = router
