import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BlogCard from "../../components/BlogCard/BlogCard";
import "./Blogs.css";
import Navbar from "../../components/Navbar/Navbar";

function Blogs() {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/user/get-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.data) {
        setPosts(response.data.data);
      } else {
        toast.warn("No posts found!");
        setPosts([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch posts");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="blogs-page">
      <Navbar />
      <div className="blog-container">
        <div className="blogs-header">
          <h1>Blogs</h1>
        </div>

        {posts.length > 0 ? (
          <div className="blogs-grid">
            {posts.map((post, index) => (
              <BlogCard
                key={post._id || index}
                title={post.title}
                content={post.content}
                date={post.createdAt || "April 26, 2025"}
              />
            ))}
          </div>
        ) : (
          <p className="no-blogs">No blogs available.</p>
        )}
      </div>
    </div>
  );
}

export default Blogs;
