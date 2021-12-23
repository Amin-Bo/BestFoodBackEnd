const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Restaurant = require("../Models/Restaurant");
const Food = require("../Models/Food");
const Cart = require("../Models/Cart");
const User = require("../Models/users");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ONE_WEEK = 604800; //Token validtity in seconds

router.get("/cart", (req, res, next) => {
    let token = req.body.token; //token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      Cart.find({ client: decoded.user._id }).populate('order').then((cart) => {
        if (!cart){
          console.log("err")
        }
        else{
          console.log(cart)
          res.send({cart})
        }
      });
    });
  }
);
router.post("/cart", (req, res, next) => {
  newFood = new Food();
  cart=new Cart();
  query =req.body._id;
  //console.log(query)
 // let token = req.headers.authorization; //token
  let token = req.body.token; //token
  Food.findById({_id:query},(err, food)=>{
    if(!food){
      console.log(err)
    }
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
      User.findOne({ _id: decoded.user._id }, (err, user) => {
        if (err) {
          res.send({ message: "user not found" });
        } else {
        cart.client=user;
        cart.order=food
        cart.quantity=req.body.quantity
        cart.save((err,cart)=>{
          if(err){
            console.log(err)
          }
          console.log(cart)
          res.send({cart})
        });
        }
      });
    });
  
    //res.send({food})
    //console.log(food)
  })

});

module.exports = router;