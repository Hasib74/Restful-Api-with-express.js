const Order =require('../models/order');
const Product=require('../models/products');
const mongoose=require('mongoose');
//const body_parser=require("body-parser");


exports.geetAllOrder=(req,res,next)=>{


    Order.find()
     //.select('quantity _id product')
    //.populate('product', 'name', 'price')
    .exec()
    .then(result=>{


        console.log(result);
        res.status(200).json({
            message:"Successfully Read All Order",
              request:{
              Types:"POST",
              count:result.length,
              body:result.map( v=>{

                return {

                     quantity:v.quantity,
                     product:v.product,
                    "order_id":v._id,
                    url:"http://localhost:3000/orders/"+v.product,
                }
              })
          }


        });

    }).catch(err=>{
        res.status(200).json(result);


    });

};

exports.createOrder=(req,res,next)=>{

    Product.findById(req.body.productId).exec().then(product=>{
     
     if(product){


         const order=new Order({

             _id:mongoose.Types.ObjectId(),
             quantity: req.body.quantity,
             product:req.body.productId,
        });
     
        order.save().then(result=>{
     
           console.log(result);
           res.status(200).json({
               message:"Order create successfully",
               request:{
                   Types:"POST",
                   body:{
                       "quantity":result.quantity,
                       "product_ref":result.product,
                       "order_id":result._id,
                   },
                   url:"http://localhost:3000/orders/"+result.product,
               }
           });
     
        }).catch(err=>{
         console.log(err);
     
         res.status(500).json(err);
     
        });
     


     }else{
         res.status(404).json({
             message : "Product Not Found",
         })
     }

    }).catch(err=>{

     res.status(404).json({
         message : "Product Not Found",
     })

    });

};
exports.updateOrderByOrderId=(req,res,next)=>{



    console.log(req.params.orderId);
    console.log(req.body.quantity);

   
        Order.findById(req.params.orderId).exec().then(order=>{
            if(order){

                Order.update({ _id : req.params.orderId } , {$set: { quantity : req.body.quantity } } ).exec().then(result=>{
                    console.log(result);
                    res.status(200).json({
                        message : "Order Update Successfully",
                        request:{
                            Types:"UPDATE",
                            body:{
                                "order_id":req.params.orderId,
                                "newQuantity":req.body.quantity
                            },
                            url:"http://localhost:3000/orders/"+req.params.orderId,
                        }
                    });
                }).catch(err=>{
            
                    res.status(404).json(err);
                })

            }else{
                res.status(404).json({
                    message:"Product is not found",
                })
            }
        }).catch(err=>{


            res.status(404).json({
                message:"Product is not found",
            })
        })


};
exports.getOrderByProduct=(req,res)=>{

    console.log("Product Id"+ req.params.productId);


    Order.find({product : req.params.productId}).exec().then(order=>{

        console.log(order);
        
    
        if(order.length>0){
             res.status(200).json({
                 message:"Order Avilable",
                 count : order.length,
                 request:{
                     type:"GET",
                     body:order.map(v=>{
                           return{
                               quantity:v.quantity,
                               "order_id":v._id,
                               product:v.product,
                           }

                     })
                 }
             })


        }else{
            res.status(404).json({
                message:"Order is not avilable",
            })
        }


    }).catch(err=>{
        res.status(404).json({
            message:"Product is not found"
        });
    })

};

exports.deleteOrderByOrderId=(req,res)=>{

    console.log("Order Id  "+req.params.orderId);


    Order.find({ _id : req.params.orderId}).then(result=>{

        console.log("Dattttttaaaa    "+  result);


         if(result){
                     
            Order.deleteOne({ _id : req.params.orderId}).then(order=>{


                console.log(order.n);
          
          
                if(order.n!=0){
          
                  res.status(200).json({
          
          
                      message:'Order Delete',
                      request:{
                          type:"DELETE",
                          orderId:req.params.productId, 
                      }
            
            
            
                  })
                } else{
          
                  res.status(404).json({
                      message:"Order Not Found"
                  })
                } 
           
          
              }).catch(err=>{
                  res.status(404).json({
                      message:"Order Not Found"
                  })
              });



         }else{
            res.status(404).json({
                message:"Order Not Found"
            })

         }


    }).catch(err=>{

        res.status(404).json({
            message:"Order Not Found"
        })
    })

    

};

exports.getOrderByOrderId=(req,res)=>{

    console.log("Order Id"+ req.params.orderId);

   Order.findById({_id:req.params.orderId}).exec().then(order=>{

       console.log(order);
       
   
       if(order){


           res.status(200).json({


               message:'Order Details',
               request:{
                   type:"GET",
                   body:{
                        quantity:order.quantity,
                       "order_id":order._id,
                        product:order.product, 
                   },
   
               }
   
           })
       }else{

           res.status(404).json({
               message:"Product is not found"
           });

       }
       

   }).catch(err=>{
       res.status(404).json({
           message:"Product is not found"
       });
   })

};