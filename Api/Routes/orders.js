const express = require('express');
const route=express.Router();
const mongoose=require('mongoose');
const controller=require('../Controller/order')

const Order=require('../models/order');

const Product=require('../models/products');

const checkAuth=require('../MiddleWare/check-auth');

route.get('/',checkAuth,controller.geetAllOrder);
route.post('/',checkAuth,controller.createOrder);
route.put('/:orderId',checkAuth,controller.updateOrderByOrderId);
route.get('/:productId',checkAuth,controller.getOrderByProduct);
route.delete('/:orderId',checkAuth, controller.deleteOrderByOrderId);
route.get('/orderId/:orderId',checkAuth,controller.getOrderByOrderId);



module.exports =route;