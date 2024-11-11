
const express =require( 'express')

const router = express.Router()

const {createProduct, getProducts, getProductById, updateProduct} = require("../controllers/product")


router.post('/create-product',createProduct)
router.get('/get-products',getProducts)
router.get('/productById/:id',getProductById)
router.put('/updateProduct/:id',updateProduct)
module.exports = router
