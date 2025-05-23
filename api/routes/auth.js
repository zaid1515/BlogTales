const express=require('express')
const { register, login, verifyEmailToken, resendEmailToken } = require('../controllers/auth')
const authRouter=express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.get('/verify-token',verifyEmailToken)
authRouter.post('/resend-email-token',resendEmailToken)

module.exports=authRouter