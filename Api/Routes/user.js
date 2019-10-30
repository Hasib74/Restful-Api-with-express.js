const express = require('express');
const route=express.Router();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const checkAuth=require('../MiddleWare/check-auth');
 

const bcrypt = require('bcryptjs');

const User =require('../models/user');

route.post('/singUp',(req,res,next) => {

    console.log(req.body.email);
    console.log(req.body.password);


    User.find({email : req.body.email })
    .exec()
    .then(result=>{

          if(result.length >=1){
              res.status(400).json({

                message:"You are alrady register"
              });
          }else{


            bcrypt.hash(req.body.password,10,(err,hash)=>{

                if(err){
                    return res.status(500).json({
                        error:err,
                    })
        
                }else{
        
                    const user=new User(
                        {
                            _id:mongoose.Types.ObjectId(),
                            email:req.body.email,
                            password:hash,
                        }
                    );
        
        
                    user.save().then(result=>{
        
                        res.status(202).json(
                            {
                                message: 'User created'
                            }
                        )
        
        
                    }).catch(err=>{
        
        
                        res.status(500).json({
                            error : err
                        })
                          
                    })
                
        
                }
        
            })

          }


    })
    .catch(err=>{

        res.json(err);
    })

   
})

route.delete('/:userId',(req,res)=>{

    User.remove({_id:req.params.userId}).then(

        res.status(200).json({
            message:"User delete"
        })
    ).catch(err=>{

        res.status(404).json(err)
    })
    

})

route.get('/',(req,res)=>{

    User.find().then(result=>{

        res.status(200).json({
            message:"All users",
            count:result.length,
            body:result.map(doc=>{
                return {
                    email:doc.email,
                    password:doc.password,
                    _id:doc._id
                }
            })
        });

    }).catch(err=>{
        res.status(404).json(err)

    })

})


route.post('/login',(req,res,next)=>{

    console.log(req.body.email);
    console.log(req.body.password);
      
    User.find({email : req.body.email }).exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:'Auth Failed'
            })
        }else{
            bcrypt.compare(req.body.password , user[0].password ,(err,result)=>{

                   if(err){
                       return res.status(401).json({
                           message :'Auth failed'
                       })
                   }

                   if(result){

                       const token = jwt.sign(
                           {
                                email :user[0].email,
                                userId : user[0]._id
                           },
                           process.env.JWT_KEY,
                           {
                              expiresIn : "1hr" 
                           }

                        )

                       return res.status(200).json({
                           message : "Auth Successful",
                           token:token
                       })
                   }
            })
        }
    })
    .catch(err=>{

        res.status(404).json({

            message:"Failed to log in",
        })
    })

})


module.exports =route;