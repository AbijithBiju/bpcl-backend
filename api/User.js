const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'my_password'
const tokenDuration = 60*60*3 // 3 hours
const verifyToken = require('../middleware/verifyToken')

const user = {
    userName:'user',
    password:'12345678',
    userId  :'user123',
    type    :'normal'
}

router.post('/login',(req,res)=>{
    console.log(req.body)
    const {userName,password} = req.body
    if( user.userName===userName && user.password===password){

        console.log('login success')

        const accessToken = jwt.sign({
            userName:user.userName,
            userType:user.type,
            userId:user.userId,
        },SECRET_KEY)

        console.log({accessToken})

        res.json({
            status:'SUCCESS',
            userId:user.userId,
            token :accessToken
        })

    }else{
        res.status(403)
    }
})

router.get('/:userName',verifyToken,(req,res)=>{
    if(req.tokenData.iat+tokenDuration > Math.trunc(Date.now()/1000)){
        if(req.tokenData.userType === 'normal'){
            res.json({
                token:'not expired',
                userType:'normal',
                data : [1,2,3,4,5,6]
            })
        }
    }else{
        res.json({
            token:'expired'
        })
    }
})



module.exports = router