const prisma = require("../script");
const { v4: uuidv4 } = require("uuid");
const createReview = async (req, res) => {
    const { userId } = req;
    const {productId,orderItemId,comment} = req.body
    try {
      const showOrder = await prisma.$queryRaw`
      SELECT
      o.id AS order_id,
      o.status,
      o.userId,
      oi.id AS order_item_id,
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
     if (showOrder.length==0) {
      return res.status(404).json({msg:"Not Found"})
     }
     console.log(showOrder)
     const matchedProduct = showOrder.find(val=>val.product_id===productId&&val.order_item_id===orderItemId&&val.status==="DELIVERED")
     
     if (!matchedProduct) {
      return res.status(404).json({msg:"Not Found"})
     }
     const reviewId = uuidv4() 
     await prisma.$queryRaw`
     insert into review (id,comment,productId,userId) values(${reviewId},${comment},${productId},${userId})
     `
     const review = await prisma.$queryRaw`
     select * from review where id = ${reviewId}
     `
     return res.json({ review });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {createReview}