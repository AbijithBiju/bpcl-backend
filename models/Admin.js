const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    userName : {
        type : String
    },
    password : {
        type : String
    },
    userType : {
        type : String,
        value: 'admin'
    },
    email:{
        type : String,
        validate : {
          validator : value => /[a-z0-9]+@([a-z]+.)+[a-z]+/.test(value),
          message : "Invalid Email"
        },
    }
})

adminSchema.methods.validatePassword =function(password) { return password === this.password }

adminSchema.methods.generateJWT =function() {
    const payload = {
        id : this._id,
        type : this.userType
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn : '24h'
    })
    return token
} 

const Admin = mongoose.model('admin',adminSchema)
module.exports = Admin