const express = require("express");
const app =express();
require('dotenv').config();
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser");
const expressValidator=require('express-validator');
const cors = require("cors");

//imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",braintreeRoutes);
app.use("/api",orderRoutes);


//// Db
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology: true
})
.then(() => console.log("db connected"));

const port=process.env.PORT || 8000

app.listen(port,()=>{
  console.log(`server is running ${port}`);
});
