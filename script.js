const express =require( 'express')
require('dotenv').config()
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
const bodyParser = require("body-parser")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
 

const app = express()
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // console.log(req)
  const endpointSecret = "whsec_6f71050149ad0e7127ddf1ba5334a13f3c87b164dcd2daf2b4c7ea4ad2dfca01";  
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400);
  }
  
  if (event.type === 'checkout.session.completed') {
    console.log("event");
    
    // const session = event.data.object;
    // const userId = session.metadata.userId;
    // const items = JSON.parse(session.metadata.items);
    // const name = session.metadata.name;
    // const contact = session.metadata.contact;
    // const address = session.metadata.address;
    // const paymentmode = session.metadata.paymentmode;

  
    // const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
      // const newOrder = await prisma.order.create({
      //   data: {
      //     userId: userId,
      //     total_amount: totalAmount,
      //     name: name,
      //     contact: contact,
      //     address: address,
      //     paymentmode: paymentmode,
      //     status: "PENDING",
      //     orderItems: {
      //       create: items.map(item => ({
      //         productId: item.id,
      //         quantity: item.quantity,
      //         price: item.price,
      //       })),
      //     },
      //   },
      // });

      // console.log(`Order created successfully with ID: ${newOrder.id}`);
      console.log(`Order created successfully with ID`);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
});
const cors = require("cors")
const routes = require("./routes/index")
app.use(cors())
app.use(express.json());

app.use("/",routes)

app.get("/",(req,res)=>{
   res.send("working")
})




app.listen(process.env.PORT,()=>{
  console.log("listening");
  
})