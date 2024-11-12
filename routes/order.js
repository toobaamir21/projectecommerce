
const express =require( 'express')

const router = express.Router()

const { createOrder, getAllOrders, getUserOrders, updateOrderStatus } = require('../controllers/order')


router.post('/create-order',createOrder)
router.get('/getAllOrders',getAllOrders)
router.get('/getUserOrders',getUserOrders)
router.put('/updateOrderStatus/:id',updateOrderStatus)


module.exports = router
