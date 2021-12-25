const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/users.js')
const passport = require('passport');
const bcrypt = require('bcryptjs');
const ONE_WEEK = 604800; //Token validtity in seconds

function isAdmin(user){
    return user.Role === 'admin'
}
function checkRole(){
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            return decoded.user.Role === 'admin'
        })    
}
router.get('/profile', (req, res, next) => {
    let token = req.headers.token || req.headers.authorization;
    jwt.verify(token, process.env.SECRET, (err, decoded) => {

    if(isAdmin(decoded.user)){

       res.json({ success: true, message: 'profile ', admin: decoded.user })
   }
   else{
       res.status(403).json({ success: false, message: 'u are not an admin'})
   }
})
});

router.post("/update", (req, res) => {
    const { firstName, lastName, email, password,Role } = req.body;
    newUser = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
        });
    });
    let token = req.body.token||req.headers.token||req.headers.authorization; //token

    //token = token.substring(4, token.length)
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(isAdmin(decoded.user)){
        User.findOne({ _id: decoded.user._id }, (err, user) => {
            User.findOneAndUpdate({ email: user.email }, newUser, {
                useFindAndModify: false,
            }).then((user) => {
                if (!user) {
                    return res.status(404).json({
                        msg: "admin not found !",
                        success: false,
                    });
                }
                user = newUser;
                const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: ONE_WEEK });
                res.status(200).json({
                    success: true,
                    user: user,
                    token,
                    msg: "admin updated successfully!",
                });
            });
        });
    }
    else{
        res.status(403).json({ success: false, message: 'u are not an admin'})

    }
    });
});

// Add a new user to the list of users
router.post('/addUser', (req, res, next)=>{
    if (checkRole) {
        let newUser = new User({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
        });
        const query = req.body.email;
        User.findOne({ email: req.body.email }, (err, user) => {
            //Error during exuting the query
            if (user) {
                return res.send({
                    success: false,
                    message: 'Error, User already exists'
                });
            } else {
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
    }
    else{
        res.status(403).json({ success: false, message: 'u are not an admin'})
    }
})
// Update user from the database
router.post('/updateUser/:_id',(req, res, next)=>{
    if (checkRole) {
        const { firstName, lastName, email, password,Role } = req.body;
        newUser = req.body;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
            });
        });
        User.findOne({ _id: req.params._id }, (err, user) => {
            console.log(user)
            User.findOne({email:newUser.email},(err, checkUser) => {
                if(!checkUser){

                    User.findOneAndUpdate({ email: user.email }, newUser, {
                        useFindAndModify: false,
                    }).then((user) => {
                        if (!user) {
                            return res.status(404).json({
                                msg: "admin not found !",
                                success: false,
                            });
                        }
                        user = newUser;
                        const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: ONE_WEEK });
                        res.status(200).json({
                            success: true,
                            user: user,
                            msg: "admin updated successfully!",
                        });
                    });
                }
                else{
                    return res.json({message:"user deja exist with this email try another one"})
                }
               
            });

        })
    }
    else{

        res.status(403).json({ success: false, message: 'u are not an admin'})
    }

})
// Delete user from the database
router.delete('/delUser/:_id',(req, res, next)=>{
    if(checkRole){
        User.findByIdAndRemove({_id:req.params._id}, (err, user)=>{
            if(user){
                return res.json({msg: 'User deleted successfully'})
            }
            else{return res.json({msg: 'User not found'})}
        })
    }
    else{
        res.status(403).json({ success: false, message: 'u are not an admin'})

    }
})
module.exports = router;