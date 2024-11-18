const prisma = require("../script");

// const createCart = async (req, res) => {
//     const { userId } = req;
//     const { productId, quantity } = req.body;

//     try {
//       const existingCart = await prisma.cart.findUnique({
//         where: { userId },
//         include: {
//           cartItems: true,
//         },
//       });

//       if (existingCart) {
//         const productInCart = existingCart.cartItems.find(
//           (item) => item.productId === productId
//         );

//         if (productInCart) {
//           return res
//             .status(400)
//             .json({ message: "Product already exists in the cart" });
//         }

//         const updatedCart = await prisma.cart.update({
//           where: { id: existingCart.id },
//           data: {
//             cartItems: {
//               create: {
//                 product_cart: {
//                   connect: { id: productId },
//                 },
//                 quantity,
//               },
//             },
//           },
//           include: {
//             cartItems: true,
//           },
//         });

//         return res.status(200).json({ cart: updatedCart });
//       } else {

//         const newCart = await prisma.cart.create({
//           data: {
//             userId,
//             cartItems: {
//               create: {
//                 product_cart: {
//                   connect: { id: productId },
//                 },
//                 quantity,
//               },
//             },
//           },
//           include: {
//             cartItems: true,
//           },
//         });

//         return res.status(201).json({ cart: newCart });
//       }
//     } catch (error) {
//       console.error("Error creating cart:", error);
//       return res.status(500).json({ error: error.message });
//     }
//   };
const { v4: uuidv4 } = require("uuid");
const createCart = async (req, res) => {
  const { userId } = req;
  const { productId, quantity } = req.body;

  try {
    const existingCart = await prisma.$queryRaw`
    SELECT * from Cart where userId = ${userId}
`;
    if (existingCart.length != 0) {
      var cartId = existingCart[0].id;
      let existingCartItems = await prisma.$queryRaw`
  SELECT * from cartitems WHERE cartId = ${cartId};
`;
      const productExist = existingCartItems.find(
        (item) => item.productId === productId
      );

      if (productExist) {
        return res
          .status(400)
          .json({ message: "Product already Exists", existingCartItems });
      } else {
        await prisma.$queryRaw` 
        INSERT INTO CARTItems(id,productId,cartId,quantity) values(${uuidv4()},${productId},${cartId},${quantity})
        `;
      }
    } else {
      var cartId = uuidv4();
      await prisma.$queryRaw`
      INSERT INTO CART(id,userId) values(${cartId},${userId})
      `;

      await prisma.$queryRaw` 
INSERT INTO CARTItems(id,productId,cartId,quantity) values(${uuidv4()},${productId},${cartId},${quantity})
`;
    }
    const showWholeCart = await prisma.$queryRaw`
    SELECT 
    c.userId,
    ci.id as cartitem_id,
    ci.productId,
    ci.quantity,
    ci.cartId
    FROM 
    CART c
    INNER JOIN 
    CARTITEMS ci
    ON
    c.id = ci.cartId
    where
    c.id = ${cartId}
    `;
    res.status(200).json({ showWholeCart });
  } catch (error) {
    console.error("Error creating cart:", error);
    return res.status(500).json({ error: error.message });
  }
};


// const getCart = async (req, res) => {
//   const { userId } = req;
//   try {
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: {
//             product_cart: true,
//           },
//         },
//       },
//     });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     res.json({ cart });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
const getCart = async (req, res) => {
  const { userId } = req;
  try {
   const cart = await prisma.$queryRaw`
   select * from cart where userId = ${userId}
   `
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const getAllCartItems = await prisma.$queryRaw`
    select
    ci.id,
    ci.cartId,
    ci.quantity,
    p.productName,
    p.description,
    p.price,
    p.id as product_id
    from
    cartitems ci
    Inner join 
    cart c
    ON
    ci.cartId =  c.id
    Inner join
    product p
    ON
    ci.productId = p.id
    where
    c.userId = ${userId}
    `

    res.json({ getAllCartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
};


// const updateCartItems = async (req, res) => {
//   const { userId } = req;
//   const { quantity, productId } = req.body;
//   try {
//     const foundCart = await prisma.cart.findFirst({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: {
//             product_cart: true,
//           },
//         },
//       },
//     });
    

//     if (!foundCart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     const foundCartItem = foundCart.cartItems.find(
//       (item) => item.productId === productId
//     );
//     if (foundCartItem) {
//       const updateCartItem = await prisma.cartItems.update({
//         where: {
//           id: foundCartItem.id,
//         },
//         data: { quantity },
//       });
//       res.status(200).json({ updateCartItem });
//     } else {
//       return res.status(404).json({ message: "Product not found in cart" });
//     }
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

const updateCartItems = async (req, res) => {
  const { userId } = req;
  const { quantity, productId } = req.body;
  const cartItemsId = req.params.id
  try {
    const userCart = await prisma.$queryRaw`
    select
    ci.id,
    ci.cartId,
    ci.quantity,
    ci.productId
    from
    cartitems ci
    Inner join 
    cart c
    ON
    ci.cartId =  c.id
    where
    c.userId = ${userId}
    `
    console.log(userCart,"userCart");
    
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
   
    const foundCartItem = userCart.find(
      (item) => item.productId === productId && item.id === cartItemsId
    );
    console.log(foundCartItem,".."); 
    if (foundCartItem) {
      await prisma.$queryRaw`
      update 
      cartitems
      set quantity = ${quantity}
      where id = ${foundCartItem.id}
      `
      const showUpdatedCart = await prisma.$queryRaw`
      select * from cartitems where id = ${foundCartItem.id}
      `
     return  res.status(200).json({ showUpdatedCart });
    } 
      return res.status(404).json({ message: "Something went wrong" });
    
  } catch (error) {
    res.status(400).json({ error });
  }
};



// const deleteCart = async (req, res) => {
//   const { userId } = req;

//   try {
//     const foundCart = await prisma.cart.findUnique({
//       where: { userId },
//       include: { cartItems: true },
//     });

//     if (!foundCart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     await prisma.cartItems.deleteMany({
//       where: { cartId: foundCart.id },
//     });

//     await prisma.cart.delete({
//       where: { id: foundCart.id },
//     });

//     res.status(200).json({ message: "Cart and cartitems deleted" });
//   } catch (error) {
//     console.error("Error deleting cart:", error);
//     res.status(400).json({ error: error.message });
//   }
// };


const deleteCart = async (req, res) => {
  const { userId } = req;
  try {
    const foundCart = await prisma.$queryRaw`
    select * from cart where userId = ${userId}
    `
    
    if (!foundCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = foundCart[0].id;
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw`DELETE FROM cartitems WHERE cartId = ${cartId}`;
      await tx.$executeRaw`DELETE FROM cart WHERE id = ${cartId}`;
    });

    res.status(200).json({ message: "Cart and cart items deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ message: "An error occurred while deleting the cart." });
  }
};


// const deleteCartItems = async (req, res) => {
//   const { cartItemId } = req.body;
//   const deleteCartItem = await prisma.cartItems.delete({
//     where: {
//       id: cartItemId,
//     },
//   });
//   console.log(deleteCartItem);
//   res.status(200).json({ deleteCartItem });
// };


const deleteCartItems = async (req, res) => {
  const { cartItemId } = req.body;
  const {userId} = req

  try {
    const userCart = await prisma.$queryRaw`
    select
    ci.id,
    ci.cartId,
    ci.quantity
    from
    cartitems ci
    Inner join 
    cart c
    ON
    ci.cartId =  c.id
    where
    c.userId = ${userId}
    `

    const deleteCartItem =  userCart.find(val=>val.id===cartItemId)

    if (deleteCartItem) {
       const deleteItem = await prisma.$executeRaw
      `DELETE FROM cartitems WHERE id = ${deleteCartItem.id}`
    ;
    console.log(deleteItem);
    return res.status(200).json({ deleteItem });
    }
    
    return res.status(404).json({ message:"Cart Item not found" });

   
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "An error occurred while deleting the cart item." });
  }
};


module.exports = {
  createCart,
  getCart,
  updateCartItems,
  deleteCart,
  deleteCartItems,
};
