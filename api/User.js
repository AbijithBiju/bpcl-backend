const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const User = require('../models/User')
const Claim = require('../models/Claim')

router.post("/login", async (req, res) => {
    console.log('request body->' + JSON.stringify(req.body));
    const user = await User.findOne({ userName: req.body.userName })
    if (user) {
        console.log('user found, _id -> ' + user._id)
        if (await user.validatePassword(req.body.password)) {
            console.log("login success");
            const accessToken = user.generateJWT()
            console.log('accessToken->' + accessToken);
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

router.get("/claimlist", verifyToken, async (req, res) => {
    if (req.tokenData.type === 'normal') {
        const user = await User.findById(req.tokenData.id)
        const claimList = new Array()
        console.log("getting claim list")
        console.log(`\t id\t\t\t\tclaim type\tself\tname\t\temp ID`)
        for (const claimId of user.claimHistory)
            await Claim.findById(claimId).then((result) => {
                if (result) {
                    console.log(`found -> ${result._id}\t${result.claimType}\t${result.self}\t${result.dependent.name}\t${result.employee.id}`)
                    claimList.push(result)
                }
            })
        res.status(200)
        res.json({
            status: "SUCCESS",
            data: claimList
        })
    } else {
        const claims = await Claim.find().where('toWhom').equals(req.tokenData.type)
        if (claims) {
            res.status(200)
            return res.json({
                status: "SUCCESS",
                data: claims
            })
        } else {
            res.status(403)
            return res.json({
                status: "FAILED"
            })
        }
    }
});

module.exports = router;