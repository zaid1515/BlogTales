const express=require('express')
const { getAllPosts } = require('../controllers/post')
const userRouter=express.Router()

userRouter.get('/get-posts',getAllPosts)

module.exports=userRouter