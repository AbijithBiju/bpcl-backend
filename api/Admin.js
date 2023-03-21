const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require('../models/User')
const Admin = require('../models/Admin')
const Dependent = require('../models/Dependent')

router.post('/login', async (req, res) => {
    await Admin.findOne({ userName: req.body.userName })
        .then(result => {
            if (result.validatePassword(req.body.password)) {
                const token = result.generateJWT()
                res.status(200)
                res.json({
                    status: 'SUCCESS',
                    message: 'login success',
                    token: token
                })
            } else {
                res.status(403)
                res.json({
                    status: 'FAILED',
                    message: 'Invalid username or password'
                })
            }
        })
})

router.post('/createuser', verifyToken, async (req, res) => {
    if (req.tokenData.type === 'admin') {
        const requiredFields = ['userName', 'userType', 'gender', 'grade', 'department', 'address', 'email', 'serviceStatus']
        for (let field of Object.keys(req.body)) {
            if (requiredFields.includes(field) && req.body[field] === "") {
                res.status(400);
                return res.json({
                    status: "FAILED",
                    message: "Empty input field(s)"
                })
            } 
        }
        const query = {
            userName: req.body.userName,
            userType: req.body.userType,
            grade: req.body.grade,
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
                    address: req.body.address || ""
                })
                await User.count({ department: req.body.department }).then(result => user.generateUserId(result))
                const password = await user.generatePassword()
                try {
                    const newUser = await user.save()
                    console.log(newUser)
                    if (newUser) {
                        console.log('saved user successfully');
                        console.log(`user name : ${user.userName}`)
                        console.log(`password  : ${password}`)
                        res.status(200);
                        return res.json({
                            status: "SUCCESS",
                            password: password,
                        });
                    }
                } catch (err) {
                    console.log(err)
                    console.log('error saving user');
                    res.status(500);
                    return res.json({
                        status: "FAILED",
                        message: err.message
                    });
                    console.log(err);
                }
            }
        })
    } else {
        res.status(403)
        return res.json({
            status: "FAILED",
            message: 'access restricted'
        })
    }
})

router.post('/addDependent/:id', verifyToken, async (req, res) => {
    if (req.tokenData.type === 'admin') {
        const user = await User.findById(req.params.id)
        if (user) {
            console.log('adding dependent to user -> ' + user.userName)
            const requiredFields = ['name', 'age', 'relation']
            for (let field of Object.keys(req.body)) {
                if (requiredFields.includes(field) && req.body[field] === "") {
                    res.status(400);
                    return res.json({
                        status: "FAILED",
                        message: "Empty input field(s)"
                    })
                }
            }
            await Dependent.findOne({ ...req.body }).then(async (result) => {
                if (result) {
                    console.log(`depentent exists ${result}`)
                    res.status(409)
                    return res.json({
                        status: 'FAILED',
                        message: 'dependent already added to db'
                    })
                } else {
                    const dependent = Dependent(req.body)
                    dependent.employee = user
                    console.log('dependent id -> '+dependent.employee._id)
                    user.dependent.push(dependent._id)
                    console.log('dependents of this user -> '+user.dependent)
                    const savedDependent = await dependent.save()
                    const savedUser = await user.save()
                    if (savedDependent && savedUser) {
                        console.log('saved user successfully');
                        res.status(200)
                        return res.json({
                            status: "SUCCESS",
                            message: "dependent added successfuly"
                        })
                    } else {
                        console.log('error saving user and dependent');
                        res.status(403)
                        return res.json({
                            status: "FAILED",
                            message: "error saving user and dependent"
                        })
                    }
                }
            })
        } else {
            res.status(403)
            return res.json({
                status: "FAILED",
                message: 'user not found'
            })
        }
    } else {
        res.status(403)
        return res.json({
            status: "FAILED",
            message: 'access restricted'
        })
    }
})

module.exports = router;

