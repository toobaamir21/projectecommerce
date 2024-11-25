const express =require( 'express')

const router = express.Router()

const userRoute = require("./user")
const productRoute = require("./product")
const cartRoute = require("./cart")
const orderRoute = require("./order")
const reviewRoute = require("./review")
const checkoutRoute = require("./checkout")

router.use("/user",userRoute)
router.use("/product",productRoute)
router.use("/cart",cartRoute)
router.use("/order",orderRoute)
router.use("/review",reviewRoute)
router.use("/checkout",checkoutRoute)

module.exports = router