const User = require('../models/user')
const{errorHandler}=require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');//to generate signed token
const expressJwt=require('express-jwt');//for authorization check
exports.signup = (req,res)=>{
  //console.log("req.body",req.body);
const user = new User(req.body);
user.save((err,user)=>{
  if (err){
    return res.status(400).json({
      err:errorHandler(err)
    });
  }
  user.salt = undefined;
  user.hashed_password=undefined;
  res.json({
    user
  });
});
};

exports.signin=(req,res)=>{
  //find the user based on Email
  const {email,password}=req.body
  User.findOne({email},(err,user)=>{
    if(err||!user){
      return res.status(400).json({
        err:"User with that email does not exist. please signUp"
      });
    }
    //if user is found make sure email passsword matches
    //create authenticatate  metghod in user models
    if(!user.authenticate(password)){
      return res.status(401).json({
        eror:"Email and password dont match"
      });
    }
    //generate a signed token with user id and secret
    const token =jwt.sign({_id:user._id},process.env.JWT_SECRET)
  //persist the token as 't in cookie with expiry date'
  res.cookie('t',token,{expire:new Date()+9999})
  //return response with user and token to frontend client
  const {_id,name,email,role}=user
  return res.json({token,user:{_id,email,name,role}});
});
};

exports.signout=(req,res)=>{
  res.clearCookie('t')
  res.json({message:"signout success"});
};

exports.requireSignin = expressJwt({
  secret:process.env.JWT_SECRET,
  userProperty:"auth",
  algorithms: ['HS256']
});

exports.isAuth=(req,res,next)=>{
  let user = req.profile && req.auth && req.profile._id == req.auth._id
if(!user){
  return res.status(403).json({
    err:"Access denied"
  });
}
next();
}
exports.isAdmin = (req,res,next)=>{
  if(req.profile.role===0){
    return res.status(403).json({
      error:"Admin resource! access denied"
    });
  }
  next();
};
