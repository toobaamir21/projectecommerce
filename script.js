const express =require( 'express')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;


require('dotenv').config()
const app = express()
const routes = require("./routes/index")
app.use(express.json());

app.use("/",routes)

app.get("/",(req,res)=>{
   res.send("working")
})


app.listen(process.env.PORT,()=>{
  console.log("listening");
  
})