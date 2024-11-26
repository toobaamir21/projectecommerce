require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const prisma = require("../script");


const checkoutSession = async (req, res) => {
    const userId = req.userId;
    
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
  
      if (products.length !== req.body.items.length) {
        console.log("Mismatch in products fetched and requested items.");
        return res.sendStatus(404);
      }
  
    
      const combinedItems = req.body.items.map(item => {
        const product = products.find(product => product.id === item.id);
        if (!product) {
          throw new Error(`Product with ID ${item.id} not found.`);
        }
        return {
          productId: product.id,
          productName: product.productName,
          price: product.price,
          quantity: item.quantity,
        };
      });
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: combinedItems.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.productName,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        metadata: {
          userId,
          items: JSON.stringify(combinedItems), 
          name: req.body.name,
          contact: req.body.contact,
          address: req.body.address,
          paymentmode: req.body.paymentmode,
        },
        success_url: `${process.env.CLIENT_URL}/success.html`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error("Error during checkout session:", error);
      res.sendStatus(500);
    }
  };
  

module.exports = { checkoutSession };
