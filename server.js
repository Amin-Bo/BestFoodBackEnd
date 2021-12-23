require('dotenv').config();
const express = require('express');
const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
var passport = require('passport')
var cors = require('cors')

// Initialize App 
const app = express();
const userRoutes = require('./Routes/users');
const restaurantRoutes = require('./Routes/restaurants');
const foodRoutes = require('./Routes/food');
const cartRoutes = require('./Routes/cart');
// DB connection
//-----------------------------------------------//
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});
Mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, {

});

Mongoose.connection.on('connected',()=>{
    console.log("connected to DB")
});
Mongoose.connection.on("error",(err)=>{
console.log("Unable to connect to DB  "+ err)
});
//-----------------------------------------------//
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(passport.initialize());
//app.use(passport.session());
require('./config/passport')(passport)
require('./config/passport2')(passport)


app.use('/user',userRoutes);
app.use('/resto',restaurantRoutes);
app.use('/food',foodRoutes);
app.use('/cart',cartRoutes);


//START APP SERVER
//---------------------------------------//
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("Server Started On port : "+PORT)
})
//---------------------------------------//
