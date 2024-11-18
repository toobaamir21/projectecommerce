class GetAllProductsDTO{
    constructor(product){   
       product.map((item)=>{
        console.log("run");
           this.id = item.id,
           this.productName = item.productName,
           this.description = item.description,
           this.price = item.price,
           this.quantity = item.quantity
           this.product_size = item.product_size.map((value)=>({sizes:value.sizes}))
           this.product_color = item.product_color.map((value)=>({colors:value.colors}))
       })
    }
}



class GetProductByIdDTO{
    constructor(products){
           this.id = products.id,
           this.productName = products.productName,
           this.description = products.description,
           this.price = products.price,
           this.quantity = products.quantity
           this.product_size = products.product_size.map((value)=>({sizes:value.sizes}))
           this.product_color = products.product_color.map((value)=>({colors:value.colors}))
   
    }
}

module.exports = {GetProductByIdDTO,GetAllProductsDTO}
