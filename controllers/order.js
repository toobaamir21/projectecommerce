const prisma = require("../script");
const { v4: uuidv4 } = require("uuid");
// const createOrder = async (req, res) => {
//   const { userId } = req;
//   const {
//     total_amount,
//     name,
//     contact,
//     address,
//     paymentmode,
//     product_Id,
//     quantity,
//     price,
//   } = req.body;

//   try {
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         total_amount,
//         name,
//         contact,
//         address,
//         paymentmode,
//         orderItems: {
//           create: {
//             productId: product_Id,
//             quantity: quantity,
//             price: price,
//           },
//         },
//       },
//       include: {
//         orderItems: {
//           include: {
//             product_items: true,
//           },
//         },
//       },
//     });

//     res.status(201).json({ order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const createOrder = async (req, res) => {
//   const { userId } = req;
//   const {
//     total_amount,
//     name,
//     contact,
//     address,
//     paymentmode,
//     product_Id,
//     quantity,
//     price,
//   } = req.body;

//   try {
//     const orderId = uuidv4();
//     console.log(orderId);
//     await prisma.$queryRaw`
//       INSERT INTO \`order\` (id, total_amount, name, contact, address, paymentmode, userId)
//       VALUES (${orderId}, ${total_amount}, ${name}, ${contact}, ${address}, ${paymentmode}, ${userId})
//     `;

   
//     await prisma.$queryRaw`
//       INSERT INTO orderitems (id, quantity, price, orderId, productId)
//       VALUES (${uuidv4()}, ${quantity}, ${price}, ${orderId}, ${product_Id})
//     `;

//     const showOrderItems = await prisma.$queryRaw`
//       SELECT
//         o.id AS order_id,
//         o.total_amount,
//         o.name,
//         o.contact,
//         o.address,
//         o.paymentmode,
//         o.status,
//         oi.id AS order_item_id,
//         oi.quantity,
//         oi.price AS order_item_price,
//         p.price AS product_price,
//         p.description AS product_description,
//         p.productName AS product_name,
//         p.id AS product_id
//       FROM
//         \`order\` o
//       INNER JOIN
//         orderitems oi
//       ON
//         oi.orderId = o.id
//       INNER JOIN
//         product p
//       ON
//         p.id = oi.productId
//       WHERE
//         o.id = ${orderId}
//     `;

//     res.status(201).json({ showOrderItems });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
const createOrder = async (req, res) => {
  const { userId } = req;
  const {
    total_amount,
    name,
    contact,
    address,
    paymentmode,
    products, 
  } = req.body;

  try {
    const orderId = uuidv4();
    console.log("Order ID:", orderId);


    await prisma.$queryRaw`
      INSERT INTO \`order\` (id, total_amount, name, contact, address, paymentmode, userId)
      VALUES (${orderId}, ${total_amount}, ${name}, ${contact}, ${address}, ${paymentmode}, ${userId})
    `;


    for (const product of products) {
      const { product_Id, quantity, price } = product;

      await prisma.$queryRaw`
        INSERT INTO orderitems (id, quantity, price, orderId, productId)
        VALUES (${uuidv4()}, ${quantity}, ${price}, ${orderId}, ${product_Id})
      `;
    }

    const showOrderItems = await prisma.$queryRaw`
      SELECT
        o.id AS order_id,
        o.total_amount,
        o.name,
        o.contact,
        o.address,
        o.paymentmode,
        o.status,
        oi.id AS order_item_id,
        oi.quantity,
        oi.price AS order_item_price,
        p.price AS product_price,
        p.description AS product_description,
        p.productName AS product_name,
        p.id AS product_id
      FROM
        \`order\` o
      INNER JOIN
        orderitems oi
      ON
        oi.orderId = o.id
      INNER JOIN
        product p
      ON
        p.id = oi.productId
      WHERE
        o.id = ${orderId}
    `;

    res.status(201).json({ showOrderItems });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
};


// const getAllOrders = async (req, res) => {
//   try {
//     const orders = await prisma.order.findMany({
//       include: {
//         orderItems: true,
//       },
//     });

//     res.json({ orders });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getAllOrders = async (req, res) => {
  try {
    const showOrders = await prisma.$queryRaw`
    SELECT
      o.id AS order_id,
      o.total_amount,
      o.name,
      o.contact,
      o.address,
      o.paymentmode,
      o.status,
      oi.id AS order_item_id,
      oi.quantity,
      oi.price AS order_item_price,
      p.price AS product_price,
      p.description AS product_description,
      p.productName AS product_name,
      p.id AS product_id
    FROM
      \`order\` o
    INNER JOIN
      orderitems oi
    ON
      oi.orderId = o.id
    INNER JOIN
      product p
    ON
      p.id = oi.productId
  `;
  if (showOrders.length==0) {
    return res.status(404).json({message:"Order not found"})
  }
  return res.json({ showOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// const getUserOrders = async (req, res) => {
//   const { userId } = req;
//   try {
//     const orders = await prisma.order.findMany({
//       where: { userId },
//       include: {
//         orderItems: true,
//       },
//     });

//     res.json({ orders });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getUserOrders = async (req, res) => {
  const { userId } = req;
  try {
    const orders = await prisma.$queryRaw`
      SELECT
      o.id AS order_id,
      o.total_amount,
      o.name,
      o.contact,
      o.address,
      o.paymentmode,
      o.status,
      o.userId,
      oi.id AS order_item_id,
      oi.quantity,
      oi.price AS order_item_price,
      p.price AS product_price,
      p.description AS product_description,
      p.productName AS product_name,
      p.id AS product_id
    FROM
      \`order\` o
    INNER JOIN
      orderitems oi
    ON
      oi.orderId = o.id
    INNER JOIN
      product p
    ON
      p.id = oi.productId
    where 
    o.userId = ${userId}  
    `
    if (orders.length==0) {
      return res.status(404).json({message:"Order not found"})
    }

   return res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getOrder = async (req, res) => {
//   const { orderId } = req.params;

//   try {
//     const order = await prisma.order.findUnique({
//       where: { id: orderId },
//       include: {
//         orderItems: true,
//       },
//     });

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.json({ order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const getOrder = async (req, res) => {
  const  orderId  = req.params.id;

  try {
    const orders = await prisma.$queryRaw`
    SELECT
    o.id AS order_id,
    o.total_amount,
    o.name,
    o.contact,
    o.address,
    o.paymentmode,
    o.status,
    o.userId,
    oi.id AS order_item_id,
    oi.quantity,
    oi.price AS order_item_price,
    p.price AS product_price,
    p.description AS product_description,
    p.productName AS product_name,
    p.id AS product_id
  FROM
    \`order\` o
  INNER JOIN
    orderitems oi
  ON
    oi.orderId = o.id
  INNER JOIN
    product p
  ON
    p.id = oi.productId
  where 
  o.id = ${orderId}  
  `
    if (orders.length==0) {
      return res.status(404).json({ error: "Order not found" });
    }

   return res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateOrderStatus = async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const order = await prisma.order.update({
//       where: { id },
//       data: {
//         status,
//       },
//     });

//     res.json({ order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const updateOrderStatus = async (req, res) => {
  const  orderId  = req.params.id;
  const {userId} = req
  const { status } = req.body;

  try {
    const orders = await prisma.$queryRaw`
    SELECT * from \`order\` where id = ${orderId}
  `
   if (orders.length==0) {
    return res.status(404).json({ error: "Order not found" });
   }
   
   const userOrder = orders.find(val=>val.userId===userId)
   if (!userOrder) {
    return res.status(404).json({ error: "Not found" });
   }
   await prisma.$executeRaw`
   update \`order\` set status = ${status} where id = ${orderId}  
   `
 const updatedOrderStatus = await prisma.$queryRaw`
 SELECT
 o.id AS order_id,
 o.total_amount,
 o.name,
 o.contact,
 o.address,
 o.paymentmode,
 o.status,
 o.userId,
 oi.id AS order_item_id,
 oi.quantity,
 oi.price AS order_item_price,
 p.price AS product_price,
 p.description AS product_description,
 p.productName AS product_name,
 p.id AS product_id
FROM
 \`order\` o
INNER JOIN
 orderitems oi
ON
 oi.orderId = o.id
INNER JOIN
 product p
ON
 p.id = oi.productId
where 
o.id = ${orderId}  
`
   return res.json({ updatedOrderStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  getOrder
};
