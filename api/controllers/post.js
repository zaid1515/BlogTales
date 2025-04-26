const { CustomAPIError } = require("../errors/custom-error");
const asyncWrap = require("../middlewares/asyncWrap");
const Post = require("../models/post");

const getAllPosts = asyncWrap(async (req, res) => {
  const allPosts = await Post.find({}).sort({ createdAt: -1 });

  if (allPosts.length === 0) {
    throw new CustomAPIError("No posts available", 404);
  }

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: allPosts,
  });
});

const createPost = asyncWrap(async (req, res) => {
  const { title, content } = req.body;
  const author = req.user?._id;

  if (!title || !content || !author) {
    throw new CustomAPIError("All fields are required", 400);
  }

  const newPost = await Post.create({ title, content, author });
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

  if (!title && !content) {
    throw new CustomAPIError("No data provided for update", 400);
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new CustomAPIError("Post not found", 404);
  }

  if (title) post.title = title;
  if (content) post.content = content;
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

module.exports={
     getAllPosts,
     createPost,
     updatePost,
     deletePost
}