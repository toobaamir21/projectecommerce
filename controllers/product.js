
const { GetAllProductsDTO, GetProductByIdDTO } = require("../dtos/product.dto");
const prisma = require("../script");
const { v4: uuidv4 } = require("uuid");
// const createProduct = async (req, res) => {

//   try {
//     const { productName, description, price, quantity, product_size, product_color } =
//       req.body;
//     const product = await prisma.product.create({
//       data: {
//         productName,
//         description,
//         price,
//         quantity,
//         product_size: {
//           create:  product_size.map((size) => ({ sizes: size })),
//         },
//         product_color: {
//           create: product_color.map((color) => ({ colors: color })),
//         },
//       },
//       select: {
//         productName: true,
//         product_size: { select: { sizes: true } },
//         product_color: { select: { colors: true } },
//       },
//     });

//     res.json({ product });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ error: error.message });
//   }
// };



const createProduct = async (req, res) => {
  try {
    const { productName, description, price, quantity, product_size, product_color } = req.body;
    const productId = uuidv4();

    await prisma.$queryRaw`
    INSERT INTO Product(id,productName, description, price, quantity) VALUES (${productId},${productName}, ${description}, ${price}, ${quantity})`;
    

    if (product_size && product_size.length > 0) {
      const values = product_size
        .map((val) => `('${uuidv4()}', '${val}', '${productId}')`)
        .join(", ");
    
      await prisma.$queryRawUnsafe(`
        INSERT INTO Size (id, sizes, productId) VALUES ${values}
      `);
      
    }
    
    if (product_color && product_color.length > 0) {
      const values = product_color
        .map((val) => `('${uuidv4()}', '${val}', '${productId}')`)
        .join(", ");
    
      await prisma.$queryRawUnsafe(`
        INSERT INTO Color (id, colors, productId) VALUES ${values}
      `);
    }  

    const wholeProduct = await prisma.$queryRaw`
    SELECT 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity,
      GROUP_CONCAT(DISTINCT s.sizes) AS sizes,
      GROUP_CONCAT(DISTINCT c.colors) AS colors
    FROM 
      Product p 
    INNER JOIN 
      Size s 
    ON 
      p.id = s.productId
    INNER JOIN 
      Color c 
    ON 
      p.id = c.productId
    WHERE 
      p.id = ${productId}
    GROUP BY 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity;
  `;
  
  res.json({ wholeProduct: wholeProduct[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};


const getProducts = async (req, res) => {
  try {
    // const products= await prisma.product.findMany({
    //     include:{
    //         product_size:true,
    //         product_color:true
    //     }
    // })
    const products = await prisma.$queryRaw`
    SELECT 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity,
      GROUP_CONCAT(DISTINCT s.sizes) AS sizes,
      GROUP_CONCAT(DISTINCT c.colors) AS colors
    FROM 
      Product p 
    INNER JOIN 
      Size s 
    ON 
      p.id = s.productId
    INNER JOIN 
      Color c 
    ON 
      p.id = c.productId
   
    GROUP BY 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity;
  `;
  
     res.json({products})
    // res.json({ products: new GetAllProductsDTO(products)});
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
    const {id} = req.params
    try {
      
      // const products= await prisma.product.findFirst({
      //    where:{
      //       id
      //    },
      //    include:{
      //       product_size:{
      //           select:{
      //               sizes:true
      //           }
      //       },
      //       product_color:{
      //           select:{
      //               colors:true
      //           }
      //       }
      //    }
      // })
      
      const getProductQuery = `
           SELECT 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity,
      GROUP_CONCAT(DISTINCT s.sizes) AS sizes,
      GROUP_CONCAT(DISTINCT c.colors) AS colors
    FROM 
      Product p 
    INNER JOIN 
      Size s 
    ON 
      p.id = s.productId
    INNER JOIN 
      Color c 
    ON 
      p.id = c.productId
    WHERE 
      p.id = '${id}'
    GROUP BY 
      p.id, 
      p.productName, 
      p.description,  
      p.price, 
      p.quantity;
  `;
  const updatedProduct = await prisma.$queryRawUnsafe(getProductQuery);
      res.json({ updatedProduct });
      // res.json({ products: new GetProductByIdDTO(updatedProduct) });  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
  
    try {
      if (data.product_size) {
        await prisma.$queryRawUnsafe(`
          DELETE FROM Size
          WHERE productId = '${id}';
        `);
  
        const sizeValues = data.product_size
          .map((size) => `(UUID(), '${size}', '${id}')`)
          .join(", ");
  
        await prisma.$queryRawUnsafe(`
          INSERT INTO Size (id, sizes, productId)
          VALUES ${sizeValues};
        `);
      }
  
      if (data.product_color) {
        await prisma.$queryRawUnsafe(`
          DELETE FROM Color
          WHERE productId = '${id}';
        `);

        const colorValues = data.product_color
          .map((color) => `(UUID(), '${color}', '${id}')`)
          .join(", ");
  
        await prisma.$queryRawUnsafe(`
          INSERT INTO Color (id, colors, productId)
          VALUES ${colorValues};
        `);
      }
  
      const updateData = [];
      if (data.productName) updateData.push(`productName = '${data.productName}'`);
      if (data.description) updateData.push(`description = '${data.description}'`);
      if (data.price) updateData.push(`price = ${data.price}`);
      if (data.quantity) updateData.push(`quantity = ${data.quantity}`);
  console.log(updateData)
      if (updateData.length > 0) {
        const updateQuery = `
          UPDATE Product
          SET ${updateData.join(", ")}
          WHERE id = '${id}';
        `;
        await prisma.$queryRawUnsafe(updateQuery);
      }

      const updatedProductQuery = `
           SELECT 
      p.id, 
      p.productName, 
      p.description, 
      p.price, 
      p.quantity,
      GROUP_CONCAT(DISTINCT s.sizes) AS sizes,
      GROUP_CONCAT(DISTINCT c.colors) AS colors
    FROM 
      Product p 
    INNER JOIN 
      Size s 
    ON 
      p.id = s.productId
    INNER JOIN 
      Color c 
    ON 
      p.id = c.productId
    WHERE 
      p.id = '${id}'
    GROUP BY 
      p.id, 
      p.productName, 
      p.description,  
      p.price, 
      p.quantity;
  `;
      const updatedProduct = await prisma.$queryRawUnsafe(updatedProductQuery);
  
      res.json({ product: updatedProduct[0] });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  

module.exports = { createProduct, getProducts,getProductById,updateProduct };
