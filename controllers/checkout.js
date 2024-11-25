require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const prisma = require("../script");

const checkoutSession = async (req, res) => {
    const userId = req.userId
  console.log("hello world");
  console.log(req.body);
  console.log(req.body.name);
  

  try {
    const products = (
      await Promise.all(
        req.body.items.map(
          (val) =>
            prisma.$queryRaw`
            SELECT id, productName, price FROM Product WHERE id = ${val.id}`
        )
      )
    ).flat();
    if (products.length != req.body.items.length) {
      return res.sendStatus(404);
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.items.map(item => {
          const productItem = products.find(product => product.id === item.id); 
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: productItem.productName
              },
              unit_amount: productItem.price * 100
            },
            quantity: item.quantity
          };
        }),
        metadata: {
            userId,
            items: JSON.stringify(req.body.items),
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            paymentmode: req.body.paymentmode, 
          },
        success_url: `${process.env.CLIENT_URL}/success.html`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      });
      

    res.json({ url: session.url })
  } catch (error) {
    console.error("Error during checkout session:", error);
    res.sendStatus(500);
  }
};

module.exports = { checkoutSession };


  