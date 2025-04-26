const express = require('express');
const { createPost, updatePost, deletePost } = require('../controllers/post');

const adminRouter = express.Router();

adminRouter.post('/posts', createPost);               
adminRouter.patch('/posts/:id', updatePost);           
adminRouter.delete('/posts/:id', deletePost);          

module.exports = adminRouter;
