
const express =require( 'express')

const router = express.Router()
const app = express()

const {createProduct, getProducts, getProductById, updateProduct} = require("../controllers/product")
const verifyJWT = require('../middleware/verifyJWT')
const validate = require('../middleware/validate')
const { createProductSchema, updateProductSchema } = require('../validations/product')

router.get('/get-products',getProducts)
router.get('/productById/:id',getProductById)
router.post('/create-product',verifyJWT,validate(createProductSchema), createProduct)
router.put('/updateProduct/:id',verifyJWT,validate(updateProductSchema),updateProduct)
module.exports = router
