import React, { useState } from 'react';
import './Createpost.css';
import { ToastContainer,toast } from 'react-toastify';

const UpdatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="createpost-container">
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
              rows="6"
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

          <button type="submit" className="createpost-button">Update Post</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
