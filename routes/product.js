
const express =require( 'express')

const router = express.Router()
const app = express()

const {createProduct, getProducts, getProductById, updateProduct} = require("../controllers/product")
const verifyJWT = require('../middleware/verifyJWT')

router.get('/get-products',getProducts)
router.get('/productById/:id',getProductById)
app.use(verifyJWT)
router.post('/create-product',createProduct)
router.put('/updateProduct/:id',updateProduct)
module.exports = router
