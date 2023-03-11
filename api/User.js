const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "my_password";
const verifyToken = require("../middleware/verifyToken");

const User = require('../models/User')

router.post("/login", async (req, res) => {
    console.log('request body->'+req.body);
    const user = await User.findOne({userName:req.body.userName}).exec()
    console.log('user found->'+user)
    if(user){
        if (user.password === req.body.password) {
            console.log("login success");
            const accessToken = user.generateJWT()
            console.log('accessToken->'+accessToken);
    
            res.json({
                status: "SUCCESS",
                token: accessToken,
            });
        } else {
            res.status(403);
            res.json({
                status: "FAILED",
                message: "Invalid username or password"
            });
        }
    }
});

router.get("/:userName", verifyToken, async (req, res) => {
    const decoded = req.tokenData
    console.log('decoded token->',decoded)
    if(decoded.type === 'doctor'){
        const user = await User.findById(decoded.id)
        console.log(user)
        if(user){
            res.status(200)
            res.json({
                status:'SUCCESS',
                data:user
            })
        }else{
            res.status(403)
            res.json({
                status: "FAILED",
                message: "User not found"
            });
        }
    }
});

module.exports = router;
