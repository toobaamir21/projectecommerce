const prisma = require("../script");

const createProduct = async (req, res) => {

  try {
    const { productName, description, price, quantity, product_size, product_color } =
      req.body;
    const product = await prisma.product.create({
      data: {
        productName,
        description,
        price,
        quantity,
        product_size: {
          create:  product_size.map((size) => ({ sizes: size })),
        },
        product_color: {
          create: product_color.map((color) => ({ colors: color })),
        },
      },
      select: {
        productName: true,
        product_size: { select: { sizes: true } },
        product_color: { select: { colors: true } },
      },
    });

    res.json({ product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products= await prisma.product.findMany({
        select:{
            productName:true,
            description:true,
            price:true,
            quantity:true,
            product_size:{
                select:{  sizes:true}
           
            },
            product_color:{
                select:{colors:true}
                
               }
        }
    })
    console.log(products);
    res.json({ products });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getProductById = async (req, res) => {
    const {id} = req.params
    try {
      const products= await prisma.product.findFirst({
         where:{
            id
         },
         include:{
            product_size:{
                select:{
                    sizes:true
                }
            },
            product_color:{
                select:{
                    colors:true
                }
            }
         }
      })
      console.log(products);
      res.json({ products });
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
      const data =  req.body;
      if (data.product_size) {
        data.product_size = {
          create: data.product_size.map((size) => ({ sizes: size }))
        };
      }
  
      if (data.product_color) {
        data.product_color = {
          create: data.product_color.map((color) => ({ colors: color })) 
        };
      }
      
      const product = await prisma.product.update({
        where: { id },
        data,
        include: {
          product_size: {
            select: {
              sizes: true
            }
          },
          product_color: {
            select: {
              colors: true
            }
          }
        }
      });
  
      res.json({ product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  

module.exports = { createProduct, getProducts,getProductById,updateProduct };
