const express=require('express')
const { getAllPosts } = require('../controllers/post')
const { getUser } = require('../controllers/user')
const userRouter=express.Router()

userRouter.get('/get-posts',getAllPosts)
userRouter.get('/:userId',getUser)

module.exports=userRouter