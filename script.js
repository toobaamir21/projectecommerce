const express =require( 'express')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;


require('dotenv').config()
const app = express()
const userRoute = require("./routes/user")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const verifyJWT = require('./middleware/verifyJWT');
app.use(express.json());
app.use("/user",userRoute)
app.use("/product",productRoute)
app.use(verifyJWT)
app.use("/cart",cartRoute)
app.use("/order",orderRoute)

app.get("/",(req,res)=>{
   res.send("working")
})


app.listen(process.env.PORT,()=>{
  console.log("listening");
  
})