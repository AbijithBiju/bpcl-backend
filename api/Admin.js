const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require('../models/User')
const Admin = require('../models/Admin')

router.post('/login',async (req,res)=>{
    await Admin.findOne({userName:req.body.userName})
    .then(result=>{
        if(result.validatePassword(req.body.password)){
            const token = result.generateJWT()
            res.status(200)
            res.json({
                status:'SUCCESS',
                message:'login success',
                token : token
            })
        }else{
            res.status(403)
            res.json({
                status:'FAILED',
                message:'Invalid username or password'
            })
        }
    })
})

router.post('/createuser', verifyToken, async (req, res) => {
    if (req.tokenData.type === 'admin') {
        const requiredFields = ['userName', 'userType', 'gender', 'department', 'address', 'email', 'serviceStatus']
        for (let field of Object.keys(req.body)) {
            if (requiredFields.includes(field) && req.body[field] === "") {
                res.status(400);
                res.json({
                    status: "FAILED",
                    message: "Empty input field(s)"
                })
            }
        }
        const query = {
            userName: req.body.userName,
            userType: req.body.userType,
            department: req.body.department,
            gender: req.body.gender,
            email: req.body.email,
            serviceStatus: req.body.serviceStatus
        }
        await User.findOne(query).then(async (result) => {
            console.log('result->', result)
            if (result) {
                console.log(`user exists ${result}`)
                res.status(409)
                return res.json({
                    status: 'FAILED',
                    message: 'User already registered'
                })
            } else {
                console.log('db checked -> no user found with same details')
                const user = User({
                    ...query,
                    address: req.body.address,
                    dependent: req.body.dependent
                })
                await User.count({ department: req.body.department }).then(result => user.generateUserId(result))
                user.generatePassword()
                try {
                    const newUser = await user.save()
                    console.log(newUser)
                    if (newUser) {
                        console.log('saved user successfully');
                        console.log(`user name : ${user.userName}`)
                        console.log(`password  : ${user.password}`)
                        res.status(200);
                        res.json({
                            status: "SUCCESS",
                            password: user.password,
                        });
                    }
                } catch (err) {
                    console.log(err)
                    console.log('error saving user');
                    res.status(500);
                    res.json({ status: "FAILED" });
                    console.log(err);
                }
            }
        })
    }else{
        res.status(403)
        res.json({
            status:"FAILED",
            message:'access restricted'
        })
    }
})

module.exports = router;
