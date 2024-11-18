
const express =require( 'express')
const router = express.Router()


const { createOrder, getAllOrders, getUserOrders, updateOrderStatus, getOrder } = require('../controllers/order')
const validate = require('../middleware/validate')
const { createOrderSchema, updateOrderStatusSchema, getOrderByOrderId } = require('../validations/order')
const verifyJWT = require('../middleware/verifyJWT')


router.post('/create-order',verifyJWT,validate(createOrderSchema) ,createOrder)
router.get('/getAllOrders',verifyJWT,getAllOrders)
router.get('/getUserOrders',verifyJWT,getUserOrders)
router.put('/updateOrderStatus/:id',verifyJWT,validate(updateOrderStatusSchema),updateOrderStatus)
router.get('/getOrderByOrderId/:id',verifyJWT,validate(getOrderByOrderId),getOrder)


module.exports = router
