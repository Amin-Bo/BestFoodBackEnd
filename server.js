require('dotenv').config();
const express = require('express');
const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
var passport = require('passport')
// Initialize App 
const app = express();
const userRoutes = require('./Routes/users');
const taskRoutes = require('./Routes/tasks');
// DB connection
//-----------------------------------------------//

Mongoose.connect(process.env.DATABASE, {

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


app.use('/user',userRoutes);
app.use('/task',taskRoutes);

app.get('/test',passport.authenticate('jwt',{session:false}), function(req, res, next){
  return res.send({
    done:"auth"
  })
})
//START APP SERVER
//---------------------------------------//
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("Server Started On port : "+PORT)
})
//---------------------------------------//
