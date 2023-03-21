const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require('../models/User')
const Admin = require('../models/Admin')
const Dependent = require('../models/Dependent')
const Claim = require("../models/Claim")

router.post('/create', verifyToken, async (req, res) => {
    if (req.tokenData.type === "normal") {
        const requiredFields = ['self', 'dependent', 'claimType', 'treatmentType', 'claimAmount']
        for (let field of Object.keys(req.body)) {
            if (requiredFields.includes(field) && req.body[field] === "") {
                res.status(400);
                return res.json({
                    status: "FAILED",
                    message: "Empty input field(s)"
                })
            }
        }
        console.log('request -> ' + JSON.stringify(req.body))
        const claim = Claim(req.body)
        claim.claimNo = await Claim.count({})
        claim.toWhom = "nurse"
        !req.body.self && await Dependent.findById(req.body.dependent).then(result => {
            if (result) {
                console.log("dependent found -> " + result.name)
                claim.dependent = {
                    id: result._id,
                    name: result.name,
                    relation: result.relation,
                    age: result.age,
                    isSMA: result.isSMA
                }
            } else {
                console.log('error finding dependent')
                res.status(409)
                return res.json({
                    status: 'FAILED',
                    message: 'error finding dependent'
                })
            }
        })
        await User.findById(req.tokenData.id).then(async (result) => {
            if (result) {

                result.addClaim(claim._id)
                await result.save()
                console.log("user found -> " + result.userName)
                console.log("user claimhistory -> " + result.claimHistory)
                claim.employee = {
                    id: result._id,
                    name: result.userName,
                    department: result.department
                }
            } else {
                console.log('error finding user')
                res.status(409)
                return res.json({
                    status: 'FAILED',
                    message: 'error finding user'
                })
            }
        })
        console.log(claim)
        const savedClaim = await claim.save()
        if (savedClaim) {
            console.log('claim saved to db')
            res.status(200)
            return res.json({
                status: 'SUCCESS',
                message: 'claim created successfuly'
            })
        } else {
            console.log('error saving claim')
            res.status(409)
            return res.json({
                status: 'FAILED',
                message: 'error saving claim'
            })
        }
    }
})

router.post('/update/:claimId', verifyToken, async (req, res) => {
    if (req.tokenData.type === 'normal') {
        const claim = await Claim.findById(req.params.claimId)
        const { approve, reject, forwardTo } = req.body
        if (approve) {
            claim.approveClaim()
            await success(req, res, claim)
        }
        if (reject) {
            claim.rejectClaim()
            await success(req, res, claim)
        }
        if (forwardTo) {
            claim.forwardTo(forwardTo)
            await success(req, res, claim)
        }
    }
})

module.exports = router;

const success = async (req, res, claim) => {
    claim.updatedBy(req.tokenData.id)
    await claim.save()
    res.status(200)
    return res.json({
        status: "SUCCESS",
        claim: claim
    })
}


