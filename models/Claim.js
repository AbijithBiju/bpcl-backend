const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const claimSchema = new mongoose.Schema({
    claimNo  : Number,
    date     : {
        type     : Date,
        immutable: true,
        default  : () => new Date()
    },
    updated:{
        time : {
            type     : Date,
            default  : () => new Date()
        },
        by : String
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

claimSchema.methods.addNurseRemark = function(remark){
    this.nurseRemark = remark
    return this.nurseRemark
}
claimSchema.methods.addDoctorRemark = function(remark){
    this.doctorRemark = remark
    return this.doctorRemark
}
claimSchema.methods.addCgmhrRemark = function(remark){
    this.cgmhrRemark = remark
    return this.cgmhrRemark
}

claimSchema.methods.forwardTo = function(person){
    this.toWhom = person
}

claimSchema.methods.approveClaim = function(){
    this.approve = true
}
claimSchema.methods.rejectClaim  = function(){
    this.reject = true
}

claimSchema.methods.updatedBy = function(person){
    this.updated.by = person
}
 
const Claim = mongoose.model('claim',claimSchema)
module.exports = Claim