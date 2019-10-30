const express = require('express');
const route=express.Router();
const Product =require('../models/products');

const multer =require('multer');

const checkAuth=require('../MiddleWare/check-auth');

const controller=require('../Controller/product');

const storage=multer.diskStorage({
    destination : function(req,file,cd){
        cd(null,'./uploads/');

    },
    filename:function(req,file,cd){

        cd(null,new Date().toISOString()+file.originalname);
    }
});

const fileFilter=(req,file,cd)=>{


    if(file.mimetype === 'image/jpeg' || file.mimetype ==='image/png' ){
        cd(null,true);

    }else{

        cd(null,false);


    }

}

const upload=multer(
    {storage : storage,
        limits : {
    fieldSize : 1024 * 1024 * 5
           },
  fileFilter:fileFilter
});

route.get('/',checkAuth, controller.getAllProduct);
route.get('/:productId',checkAuth,controller.getProductById);
route.post('/',upload.single("productImage") ,checkAuth,controller.insertProduct);
route.patch('/:productId', checkAuth,controller.productUpdateById);
route.delete('/:productId',checkAuth,controller.deleteProductById);

module.exports =route;