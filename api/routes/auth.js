const express=require('express')
const { register, login, verifyEmailToken } = require('../controllers/auth')
const authRouter=express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.get('/verify-token',verifyEmailToken)

module.exports=authRouter