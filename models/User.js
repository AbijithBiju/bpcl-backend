const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    password: {
        type: String
    },
    userType: {
        type: String,
        enum: {
            values: ['normal', 'nurse', 'doctor', 'cgmhr'],
            message: 'Invalid type'
        }
    },
    userId: {
        type: String
    },
    grade: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: 'Invalid Gender'
        }
    },
    department: {
        type: String,
        enum: {
            values: ['canteen', 'school'],
            message: 'Invalid Department'
        }
    },
    address: {
        houseName: String,
        district: String,
        city: String,
        state: String,
        pincode: {
            type: Number,
            validate: {
                validator: value => /^[1-9]{1}[0-9]{2}[0-9]{3}$/.test(value),
                message: 'Invalid pincode'
            }
        }
    },
    email: {
        type: String,
        validate: {
            validator: value => /[a-z0-9]+@([a-z]+.)+[a-z]+/.test(value),
            message: "Invalid Email"
        },
    },
    serviceStatus: {
        type: String,
        enum: {
            values: ['serving', 'retired'],
            default: 'serving'
        }
    },
    claimHistory: {
        type: []
    },
    claimedAmount: {
        type: Number
    },
    claimLimit: {
        type: Number
    },
    dependent: [],
    isSMA: {
        type: Boolean
    }
})

userSchema.methods.generateJWT = function () {
    const payload = {
        id: this._id,
        type: this.userType
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '3h'
    })
    return token
}

userSchema.methods.generateUserId = function (id) {
    console.log(id)
    this.userId = id.toString().padStart(4, '0')
    return this.userId
}

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generatePassword = async function () {

    const str = this.userName.slice(0, 3)
    const num = this.userId
    const dep = this.department
    const password = `${str}${num}@${dep}`

    await bcrypt.genSalt(saltRounds).then(salt => {
            console.log('Salt: ', salt)
            return bcrypt.hash(password, salt)
        }).then(hash => {
            this.password = hash
            console.log('Hash: ', hash)
        }).catch(err => console.error(err.message))

    return password

}

userSchema.methods.addDependent = function (id) {
    this.dependent.push(id)
    return this.dependent
}

userSchema.methods.setSMA = function () {
    this.isSMA = true
    return this.isSMA
}

userSchema.methods.removeSMA = function () {
    this.isSMA = false
    return this.isSMA
}

userSchema.methods.addClaim = function (id) {
    this.claimHistory.push(id)
    return this.claimHistory
}

const User = mongoose.model('user', userSchema)
module.exports = User