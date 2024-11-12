const prisma = require("../script");

const createCart = async (req, res) => {
    const { userId } = req;
    const { productId, quantity } = req.body;
  
    try {
      const existingCart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          cartItems: true,
        },
      });
  
      if (existingCart) {
        const productInCart = existingCart.cartItems.find(
          (item) => item.productId === productId
        );
  
        if (productInCart) {
          return res
            .status(400)
            .json({ message: "Product already exists in the cart" });
        }
  
        
        const updatedCart = await prisma.cart.update({
          where: { id: existingCart.id },
          data: {
            cartItems: {
              create: {
                product_cart: {
                  connect: { id: productId },
                },
                quantity,
              },
            },
          },
          include: {
            cartItems: true,
          },
        });
  
        return res.status(200).json({ cart: updatedCart });
      } else {
       
        const newCart = await prisma.cart.create({
          data: {
            userId,
            cartItems: {
              create: {
                product_cart: {
                  connect: { id: productId },
                },
                quantity,
              },
            },
          },
          include: {
            cartItems: true,
          },
        });
  
        return res.status(201).json({ cart: newCart });
      }
    } catch (error) {
      console.error("Error creating cart:", error);
      return res.status(500).json({ error: error.message });
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
            product_cart: true,
          },
        },
      },
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCartItems = async (req, res) => {
  const { userId } = req;
  const { quantity, productId } = req.body;
  try {
    const foundCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product_cart: true,
          },
        },
      },
    });

    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const foundCartItem = foundCart.cartItems.find(
      (item) => item.productId === productId
    );
    if (foundCartItem) {
      const updateCartItem = await prisma.cartItems.update({
        where: {
          id: foundCartItem.id,
        },
        data: { quantity },
      });
      res.status(200).json({ updateCartItem });
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const deleteCart = async (req, res) => {
  const { userId } = req;

  try {
    const foundCart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: true },
    });

    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    await prisma.cartItems.deleteMany({
      where: { cartId: foundCart.id },
    });

    await prisma.cart.delete({
      where: { id: foundCart.id },
    });

    res.status(200).json({ message: "Cart and cartitems deleted" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteCartItems = async (req, res) => {
  const { cartItemId } = req.body;
  const deleteCartItem = await prisma.cartItems.delete({
    where: {
      id: cartItemId,
    },
  });
  console.log(deleteCartItem);
  res.status(200).json({ deleteCartItem });
};


module.exports = {
  createCart,
  getCart,
  updateCartItems,
  deleteCart,
  deleteCartItems,
};
