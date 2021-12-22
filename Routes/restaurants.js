const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Restaurant = require('../Models/Restaurant')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const ONE_WEEK = 604800; //Token validtity in seconds

//Login
router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const query = {email}
  //Check the restaurant exists
  Restaurant.findOne(query, (err, restaurant) => {
    //Error during exuting the query
    if (err) {
      return res.send({
        success: false,
        message: 'Error, please try again'
      });
    }

    //No restaurant match the search condition
    if (!restaurant) {
      return res.send({
        success: false,
        message: 'Error, Restaurant not found'
      });
    }

    //Check if the password is correct
    restaurant.isPasswordMatch(password, restaurant.password, (err, isMatch) => {
      
        //Invalid password
        if (!isMatch) {
          return res.send({
            success: false,
            message: 'Error, Invalid Password'
          });
        }

        //restaurant is Valid

        const ONE_WEEK = 604800; //Token validtity in seconds

        //Generating the token
        const token = jwt.sign({ restaurant }, process.env.SECRET, { expiresIn: ONE_WEEK });
        console.log(token)
        //console.log( jwt.decode(token))
        //restaurant Is Valid
        //This object is just used to remove the password from the returned fields
        let returnRestaurant = {
          name: restaurant.name,
          email: restaurant.email,
          id: restaurant._id,
        }
        
        //Send the response back
        return res.send({
          success: true,
          message: 'You are logged in now',
          restaurant: restaurant,
          token
        });
    });

  });

});

//Registration
router.post('/register', (req, res, next) => {
  let newRestaurant = new Restaurant({
    name: req.body.name,
    position: req.body.position,
    logo: req.body.logo,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  });
  const query = req.body.email;
  //Check the restaurant exists
  Restaurant.findOne({email: req.body.email}, (err, restaurant) => {
    //Error during exuting the query
    if (restaurant) {
      return res.send({
        success: false,
        message: 'Error, restaurant already exists'
      });
    }else{
      newRestaurant.save((err, restaurant) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Failed to save the restaurant'
          });
        }
        res.send({
          success: true,
          message: 'restaurant Saved',
          restaurant
        });
      });
    }
  });
  
});

router.get('/profile',passport.authenticate('jwt',{session:false}), (req, res, next) => {
  res.json({success: true, message: 'profile ',restaurant: req.user})
});

router.post("/update",passport.authenticate('jwt',{session:false}) ,(req, res) => {
  const {name,logo, position, phone, email, password } = req.body;
  newrestaurant = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newrestaurant.password, salt, (err, hash) => {
      if (err) throw err;
      newrestaurant.password = hash;
    });
  });
   let token = req.headers.authorization; //token
   token = token.substring(4, token.length)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    Restaurant.findOne({ _id: decoded.restaurant._id }, (err, restaurant) => {
      Restaurant.findOneAndUpdate({ email: restaurant.email }, newrestaurant, {
        useFindAndModify: false,
      }).then((restaurant) => {
        if (!restaurant) {
          return res.status(404).json({
            msg: "restaurant not found !",
            success: false,
          });
        }
        restaurant=newrestaurant;
        const token = jwt.sign({ restaurant }, process.env.SECRET, { expiresIn: ONE_WEEK });
        res.status(200).json({
          success: true,
          restaurant,
          token,
          msg: "restaurant updated successfully!",
        });
      });
    });
  });
});
router.get("/restaurants", (req, res) => {
  Restaurant.find({}).then((restaurants) => {
    if (!restaurants) {
      return res.status(404).json({
        msg: "restaurants not found !",
        success: false,
      });
    }
    console.log(restaurants)
    res.status(200).json({
      success: true,
      restaurants,
      msg: "all restaurants !",
    });
  });
});
module.exports = router;