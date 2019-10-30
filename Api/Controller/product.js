const Product =require('../models/products');
const mongoose=require('mongoose');

exports.insertProduct=(req,res)=>{

    console.log(req.file);
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path
    });

    product.save().then(result =>{
           
        
           console.log(result);

            res.status(201).json({
            message:"Successfully Saved Product",
            product:{
                product_name:result.name,
                product_price:result.price,
                product_id:result._id,
                productImage:req.file.path,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result._id,
                },

                
            }
        })

    }).catch(error => {
           console.log(error);
    });

};

exports.getAllProduct=(req,res)=>{

    Product.find()
       .select('name price _id productImage')
       .exec().then(

        result=>{


            const response={
                count:result.length,
                products:result.map(doc=>{
                    
                    return {
                        product_name:doc.name,
                        product_price:doc.price,
                        product_id:doc._id,
                        productImage:doc.productImage,

                        request:{
                            type:'GET',
                            url:'http://localhost:3000/products/'+doc._id,
                        },
                       

                    }

                })
            }


            res.status(200).json({

                data:response,
            });
        }

    ).catch(err=>{

        res.status(500).json({

            error:err

        });
    })

};

exports.getProductById=(req,res,next)=>{

    const id=req.params.productId;

    console.log(id);

    Product.findById(id).exec().then(result =>{

             console.log("The data is "+result);

             if(result){
                res.status(200).json({
                    message:"Product Avilable",
                    request:{
                        type:"POST",
                        body:{
                            "product_name":result.name,
                            "product_price":result.price,
                            "product_id":result._id,
                        },
                        url:"http://localhost:3000/products/"+result._id
                    }
                });

             }else{
                res.status(404).json({

                    message:'Id is not correct'
                });


             }

    })
    .catch(err=>{
        console.log(err);

        res.status(500).json({
            error:err,
        })
    });


};
exports.productUpdateById=(req,res,next)=>{

    const updateOps={};

    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }

  // Product.update({_id:req.params.productId},{$set:{name:req.body.newName,price:req.body.newPrice}})
   Product.update({_id:req.params.productId},{$set : updateOps}).exec().then(result=>{

      console.log(result);
           
      res.status(200).json({
            message:"Update product successfully",
            request:{
                type:"PATCH",
                body:updateOps,
                url:"http://localhost:3000/products/"+req.params.productId,

            }

      });

   }).catch(err=>{

    res.status(500).json(err);

   })


};
exports.deleteProductById=(req,res)=>{
    Product.findByIdAndDelete(req.params.productId).then(result=>{

        console.log(result);

        if(result){
            
            res.status(200).json({

                message:"Product deleted successfully",
                request:{
                    type:"DELETE",
                    body:{
                        "product_name":result.name,
                        "product_price":result.price,
                        "product_id":result._id,
                    }
                } 

            });

        }else{
            res.status(404).json({

                message:"Product is not avilable"
            })
        }

    }).catch(err=>{

        res.status(500).json(err);

    })
};