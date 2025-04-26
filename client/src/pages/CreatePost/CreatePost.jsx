import React, { useState } from 'react';
import './Createpost.css';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('title', formData.title);
    postData.append('content', formData.content);
    if (formData.image) {
      postData.append('image', formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/posts",
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success("Post Created Successfully!");
      console.log(response.data);
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="createpost-container">
      <ToastContainer />
      <div className="createpost-card">
        <h2 className="createpost-title">Create New Post</h2>

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
              rows="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="createpost-button">Publish Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
