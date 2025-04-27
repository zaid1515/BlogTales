const { CustomAPIError } = require("../errors/custom-error");
const asyncWrap = require("../middlewares/asyncWrap");
const Post = require("../models/post");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const getAllPosts = asyncWrap(async (req, res) => {
  const allPosts = await Post.find({}).sort({ createdAt: -1 }).populate({
    path: "author",
    select: "name",
  });

  if (allPosts.length === 0) {
    throw new CustomAPIError("No posts available", 404);
  }

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: allPosts,
  });
});

const getPost = asyncWrap(async (req, res) => {
  const {postId}=req.params
  if(!postId){
    throw new CustomAPIError("Post Id is required",400)
  }

  const post = await Post.findById(postId)

  if (!post) {
    throw new CustomAPIError("Post Not Found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    data: post,
  });
});

const createPost = asyncWrap(async (req, res) => {
  const { title, content } = req.body;
  const author = req.user?._id;

  if (req.file) {
    const filePath = path.resolve(req.file.path);
    console.log("Uploading file from:", filePath);
    cloud_res = await cloudinary.uploader.upload(filePath);
  }

  if (!title || !content || !author) {
    throw new CustomAPIError("All fields are required", 400);
  }

  const newPost = await Post.create({
    title,
    content,
    author,
    thumbnail: cloud_res ? cloud_res.url : null,
  });
  if (!newPost) {
    throw new CustomAPIError("Failed to create a post", 405);
  }

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: newPost,
  });
});

const updatePost = asyncWrap(async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;

  if (!id) {
    throw new CustomAPIError("Post ID is required", 400);
  }

  if (!title && !content && !req.file) {
    throw new CustomAPIError("No data provided for update", 400);
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new CustomAPIError("Post not found", 404);
  }

  if (title) post.title = title;
  if (content) post.content = content;

  if (req.file) {
    const filePath = path.resolve(req.file.path);
    cloud_res = await cloudinary.uploader.upload(filePath);
    post.thumbnail = cloud_res.secure_url || cloud_res.url;
  }
  const updatedPost = await post.save();
  
  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});

const deletePost = asyncWrap(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomAPIError("Post ID is required", 400);
  }

  const deletedPost = await Post.findOneAndDelete({ _id: id });

  if (!deletedPost) {
    throw new CustomAPIError("Post not found or already deleted", 404);
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: [],
  });
});

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
