require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const prisma = require("../script");


const checkoutSession = async (req, res) => {
  const userId = req.userId;
  // console.log(req.body.name);
  // console.log(req.body.contact);
  // console.log(req.body.address);
  // console.log(req.body.paymentmode);

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
      console.log("not working");
      return res.sendStatus(404);
    }
    // console.log(products);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const productItem = products.find((product) => product.id === item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productItem.productName,
            },
            unit_amount: productItem.price * 100,
          },  
          quantity: item.quantity,
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

    // console.log(session, "session");

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error during checkout session:", error);
    res.sendStatus(500);
  }
};

module.exports = { checkoutSession };
