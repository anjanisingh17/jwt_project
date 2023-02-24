const UserModel = require('../models/user')
const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router =  new express.Router();

router.get('/',(req,res)=>{

    res.cookie('jwt','thisisthecookievalue',{
        expires: new Date(Date.now() + 3000),
        httpOnly:true
    })

    res.send('Welcome to home page');

})

router.post('/userapi/register',async(req,res)=>{

    try {
        const user =   new UserModel(req.body);

        const token = await user.generateAuthToken();
        console.log(`Token at register route ${token}`)

        const result = await user.save(); 
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error);        
    }

})

router.post('/userapi/login', async(req,res)=>{

    const email = req.body.email;
    const password = req.body.password;
    

     const userAvailable = await UserModel.findOne({email:email});

     if(!userAvailable){
        res.status(500).send('Invalid login credentials')
     }

     const match = await bcrypt.compare(password,userAvailable.password) 

     if(match){
        const token = await userAvailable.generateAuthToken();
        
        // res.cookie('jwt',token,{
        //     expires: new Date(Date.now() + 30000), //Expries after 3 seconds from now
        //     httpOnly:true,    //Client side any language unable to destroy the cookie if we use this property
        //     // secure:true    //Only use this property when your have secure connection
        // })
        res.status(200).send(`hello mr ${userAvailable.firstname}, welcome to login page, your token is ${token}  `)
     }else{
        res.status(500).send('Invalid login credentials');
     }

})

const authMiddleware = (req,res,next)=>{
   if(!req.headers['authorization']){
    res.send("please provide token");
    return;
   }
   try {
    
  
   let token = req.headers['authorization'].split(' ')[1];
   const decode = jwt.verify(token,process.env.Secret_key)
   if(decode._id){
      next();
   }else{
        res.send("please provide Valid token"); 
        return;
   }
}
   catch (error) {
    res.send(error); 
   }
    
}   

router.get('/userapi/welcome',authMiddleware,(req,res)=>{

    res.send('welcome to welcome page')

})



module.exports = router;