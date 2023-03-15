const mongoose = require('mongoose')
const User = require('./User')

const dependentSchema = new mongoose.Schema({
    name     : String,
    age      : Number,
    relation : {
        type    : String,
        enum    : {
            values  : ['wife','husband','child','mother','father','sibling'],
            message : 'Invalid relation'
        },     
    },
    employee   : mongoose.model('user').schema,
    isVerified : Boolean,
    isSMA      : Boolean
})

dependentSchema.methods.setSMA = function(){
    this.isSMA = true
    return this.isSMA
}

dependentSchema.methods.removeSMA = function(){
    this.isSMA = false
    return this.isSMA
}

dependentSchema.methods.setEmployee = async function(id){
    const employee = await User.findById(id)
    this.employee = employee
    return this.employee
}

dependentSchema.methods.findEmployeeId = function(){
    return this.employee.__id
} 

const Dependent = mongoose.model('dependent',dependentSchema)
module.exports = Dependent