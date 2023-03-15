const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "my_password";
const verifyToken = require("../middleware/verifyToken");

const User = require('../models/User')

router.post("/login", async (req, res) => {
    console.log('request body->'+JSON.stringify(req.body));
    const user = await User.findOne({userName:req.body.userName})
    console.log('user found, _id -> '+user._id)
    if(user){
        if (await user.validatePassword(req.body.password)) {
            console.log("login success");
            const accessToken = user.generateJWT()
            console.log('accessToken->'+accessToken);
            res.json({
                status: "SUCCESS",
                id: user._id,
                token: accessToken,
            });
        } else {
            console.log("login failed");
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
