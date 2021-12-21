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
  //Check the user exists
  Restaurant.findOne(query, (err, restaurant) => {
    //Error during exuting the query
    if (err) {
      return res.send({
        success: false,
        message: 'Error, please try again'
      });
    }

    //No User match the search condition
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

        //User is Valid

        const ONE_WEEK = 604800; //Token validtity in seconds

        //Generating the token
        const token = jwt.sign({ restaurant }, process.env.SECRET, { expiresIn: ONE_WEEK });
        console.log(token)
        //console.log( jwt.decode(token))
        //User Is Valid
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
          restaurant: returnRestaurant,
          token
        });
    });

  });

});

//Registration
router.post('/register', (req, res, next) => {
  let newRestaurant = new Restaurant({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password
  });
  const query = req.body.email;
  //Check the user exists
  User.findOne({email: req.body.email}, (err, user) => {
    //Error during exuting the query
    if (user) {
      return res.send({
        success: false,
        message: 'Error, User already exists'
      });
    }else{
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Failed to save the user'
          });
        }
        res.send({
          success: true,
          message: 'User Saved',
          user
        });
      });
    }
  });
  
});

router.get('/profile', passport.authenticate('jwt',{session: false}),(req, res, next) => {
 req.user.password=''
  res.json({success: true, message: 'profile ',user: req.user})
});

router.post("/update",passport.authenticate('jwt',{session:false}) ,(req, res) => {
  const { firstName, lastName, email, password } = req.body;
  newUser = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
    });
  });
   let token = req.headers.authorization; //token
   token = token.substring(4, token.length)
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    User.findOne({ _id: decoded.user._id }, (err, user) => {
      User.findOneAndUpdate({ email: user.email }, newUser, {
        useFindAndModify: false,
      }).then((user) => {
        if (!user) {
          return res.status(404).json({
            msg: "user not found !",
            success: false,
          });
        }
        const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: ONE_WEEK });
        res.status(200).json({
          success: true,
          user,
          token,
          msg: "User updated successfully!",
        });
      });
    });
  });
});
module.exports = router;