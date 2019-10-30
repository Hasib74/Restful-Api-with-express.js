const express= require('express');
const app=express();

const productsRoutes=require('./Api/Routes/products');
const oderRoutes=require('./Api/Routes/orders');
const userRoutes=require('./Api/Routes/user');

const morgan=require('morgan');

const bodyParser=require('body-parser');
const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://Hasib-74:hasibakonjoy993@cluster0-hq6uh.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true  }).then(result=>{

    console.log("database is connected");

}).catch(err=>{

    console.log(err);

    console.log("database is not able to connect ");

});


 


app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());  

app.use((req,res,next)=>{

    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type',);


    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods','PUT,POST,DELETE,GET');
        return res.status(200).json({});
    }
    next();

});

app.use('/products',productsRoutes);
app.use('/orders',oderRoutes);
app.use('/users',userRoutes);


app.use((req,res,next)=>{

    const error=new Error('Not found');
    error.status=400;

    next(error);

});


app.use((error,req,res,next)=>{

    res.status(error.status || 500);
    res.json({
        error:{
           message:error.message

        }
    })
     

});


module.exports = app;