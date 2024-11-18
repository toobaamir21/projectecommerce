const express =require( 'express')

const router = express.Router()

const userRoute = require("./user")
const productRoute = require("./product")
const cartRoute = require("./cart")
const orderRoute = require("./order")
const reviewRoute = require("./review")

router.use("/user",userRoute)
router.use("/product",productRoute)
router.use("/cart",cartRoute)
router.use("/order",orderRoute)
router.use("/review",reviewRoute)

module.exports = router