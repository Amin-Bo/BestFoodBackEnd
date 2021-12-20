const express = require('express');
const passport = require('passport');
const router = express.Router(); 
const Task = require('../Models/tasks');
const jwt = require('jsonwebtoken')

router.get('/task', authenticateToken, (req,res,next)=>{
    return res.send({
        hello:"hello user"
    })
})
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  //  console.log(token)
   console.log(jwt.verify(token,process.env.SECRET))
    
  }
module.exports=router;