import React, { useState } from "react";
import "./CreatePost.css";
import { ToastContainer, toast } from "react-toastify";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import URI from "../../URI";

const UpdatePost = () => {
  const navigate=useNavigate()
  const token = localStorage.getItem("token");

  const params = useParams();
  const postId = params.postId;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const title = queryParams.get("title");
  const content = queryParams.get("content");
  const thumbnail=queryParams.get("thumnail")

  const [formData, setFormData] = useState({
    title: `${decodeURIComponent(title)}`,
    content: `${decodeURIComponent(content)}`,
    image: `${decodeURIComponent(thumbnail)}`,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    console.log(formData)
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    console.log(postData)
    if (formData.image) {
      postData.append("blogImage", formData.image);
    }

    try {
      const response = await axios.patch(
        `${URI}/api/admin/posts/${postId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Post Updated Successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="createpost-container">
      <Link to="/dashboard" className="back-button"><IoArrowBack size={24} /> Back to Dashboard</Link>
      <ToastContainer />
      <div className="createpost-card">
        <h2 className="createpost-title">Update Post</h2>

        <form className="createpost-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Post Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter post content"
              required
              rows="12"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Update Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="createpost-button">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
