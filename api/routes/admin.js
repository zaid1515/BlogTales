const express = require('express');
const { createPost, updatePost, deletePost } = require('../controllers/post');
const upload = require('../utils/fileStorage');

const adminRouter = express.Router();

adminRouter.post('/posts',upload.single('blogImage'), createPost);               
adminRouter.patch('/posts/:id',upload.single('blogImage'), updatePost);           
adminRouter.delete('/posts/:id', deletePost);          

module.exports = adminRouter;
