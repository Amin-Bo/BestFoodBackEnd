const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Restaurant = require("../Models/Restaurant");
const Food = require("../Models/Food");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const ONE_WEEK = 604800; //Token validtity in seconds

router.get(
  "/food",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log(req.user);
    res.json({ success: true, message: "profile ", restaurant: req.user });
  }
);
router.post("/food", (req, res, next) => {
  const { name, price, img, category } = req.body;
  newFood = new Food();
  newFood.name = req.body.name;
  newFood.price = req.body.price;
  newFood.img = req.body.img;
  newFood.category = req.body.category;
  //console.log(newFood);
  //let token = req.headers.authorization; //token

  let token = req.body.token; //token
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    Restaurant.findOne({ _id: decoded.restaurant._id }, (err, restaurant) => {
      if (err) {
        res.send({ message: "restaurant not found" });
      } else {
        newFood.restaurant = restaurant;
        console.log(newFood);
        newFood.restaurant = restaurant;
        newFood.save();
        restaurant.foods.push(newFood);
        restaurant.save();
        res.send({ message: "Food saved successfully" });
      }
    });
  });
});

module.exports = router;
