const express =require( 'express')

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;
const bodyParser = require("body-parser")
require('dotenv').config()

const app = express()
const cors = require("cors")
const routes = require("./routes/index")
app.use(cors())
app.use(express.json());

app.use("/",routes)

app.get("/",(req,res)=>{
   res.send("working")
})


app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const items = JSON.parse(session.metadata.items);
    const name = session.metadata.name;
    const contact = session.metadata.contact;
    const address = session.metadata.address;
    const paymentmode = session.metadata.paymentmode;

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    try {
      const newOrder = await prisma.order.create({
        data: {
          userId: userId,
          total_amount: totalAmount,
          name: name,
          contact: contact,
          address: address,
          paymentmode: paymentmode,
          status: "PENDING",
          orderItems: {
            create: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      console.log(`Order created successfully with ID: ${newOrder.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
});

app.listen(process.env.PORT,()=>{
  console.log("listening");
  
})