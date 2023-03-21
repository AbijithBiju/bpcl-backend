const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const claimSchema = new mongoose.Schema({
    claimNo  : Number,
    date     : {
        type     : Date,
        immutable: true,
        default  : ()=>new Date()
    },
    employee : {},
    self     :Boolean,
    dependent: {},
    claimType: {
        type: String,
        enum: {
            values: ['Domicillary', 'Hospitalisation'],
            message: 'Invalid Claim Type'
        }
    },
    treatmentType:String,
    claimAmount:Number,
    settledTaxableAmt:Number,
    settledNonTaxableAmt:Number,
    toWhom: {
        type: String,
        enum: {
            values: ['nurse', 'doctor', 'cgmhr'],
            message: 'Invalid type'
        }
    },
    nurseRemark:String,
    doctorRemark:String,
    cgmhrRemark:String,
    approved:Boolean,
    reject:Boolean
})

const Claim = mongoose.model('claim',claimSchema)
module.exports = Claim