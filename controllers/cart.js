const prisma = require("../script");

const createCart = async (req, res) => {
    const { userId } = req;
    const { productId, quantity } = req.body;
  
    try {
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
      });
  
      if (existingCart) {
        const updatedCart = await prisma.cart.update({
          where: { userId },
          data: {
            cartItems: {
              create: [
                {
                  product_Cart: {
                    connect: { id: productId },
                  },
                  quantity,
                },
              ],
            },
          },
          include: {
            cartItems: true,
          },
        });
  
        res.json({ updatedCart });
      } else {
        const newCart = await prisma.cart.create({
          data: {
            userId,
            cartItems: {
              create: [
                {
                  product_Cart: {
                    connect: { id: productId },
                  },
                  quantity,
                },
              ],
            },
          },
          include: {
            cartItems: true,
          },
        });
  
        res.json({ newCart });
      }
    } catch (error) {
      console.error("Error creating cart:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  

  const getCart = async (req, res) => {
    const { userId } = req; 
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: {
            include: {
              product_Cart: true, 
            },
          },
        },
      });
  
      res.json({ cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: error.message });
    }
  };

  
  
  module.exports = {createCart,getCart}