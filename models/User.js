const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    userName : {
        type : String
    },
    password : {
        type : String
    },
    userType : {
        type : String,
        enum : {
            values : ['normal','nurse','doctor','cghmr'],
            message: 'Invalid type'
        }
    },
    userId : {
        type : String
    },
    gender : {
        type : String,
        enum : {
            values : ['male','female','other'],
            message : 'Invalid Gender'
        }
    },
    department : {
        type : String,
        enum : {
            values : ['canteen','school'],
            message : 'Invalid Department'
        }
    },
    address:{
        houseName : String,
        district : String,
        city : String,
        state : String,
        pincode : {
            type:Number,
            validate:{
                validator : value => /^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(value),
                message:'Invalid pincode'
            }
        }
      },
    email:{
        type : String,
        validate : {
          validator : value => /[a-z0-9]+@([a-z]+.)+[a-z]+/.test(value),
          message : "Invalid Email"
        },
    },
    serviceStatus : {
        type : String,
        enum : {
            values : ['serving','retired'],
            default : 'serving'
        }
    },
    claimHistory : {
        type : [{id:mongoose.Types.ObjectId}]
    },
    claimedAmount : {
        type : Number
    },
    claimLimit : {
        type : Number
    },
    dependent : {
        type : [{id:mongoose.Types.ObjectId}]
    },
    isSMA : {
        type : Boolean
    }
})

userSchema.methods.validatePassword =(password)=> password === this.password

userSchema.methods.generateJWT =function() {
    const payload = {
        id : this._id,
        type : this.userType
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn : '3h'
    })
    console.log(jwt.verify(token, process.env.JWT_SECRET_KEY))
    return token
} 

userSchema.methods.generateUserId = function(id) {
    console.log(id)
    this.userId = id.toString().padStart(4,'0')
    return this.userId
}

userSchema.methods.generatePassword = function(){
    const str = this.userName.slice(0,3)
    const num = this.userId
    const dep = this.department
    console.log('num->'+num)
    this.password = `${str}.${num}@${dep}`
}

const User = mongoose.model('user',userSchema)
module.exports = User