import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import BlogCard from "../../components/BlogCard/BlogCard";
import "./Blogs.css";
import Navbar from "../../components/Navbar/Navbar";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import URI from "../../URI";

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in");
        navigate('/login')
      }
      const response = await axios.get(
        `${URI}/api/user/get-posts`,
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="blogs-page">
      <Navbar />
      <div className="blog-container">
        {role === "admin" && (
          <Link to="/dashboard" className="back-button">
            <IoArrowBack size={24} />
            Back to Dashboard
          </Link>
        )}
        <div className="blogs-header">
          <h1>Blogs</h1>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <h2>Loading...</h2>
          </div>
        ) : posts.length > 0 ? (
          <div className="blogs-grid">
            {posts.map((post, index) => (
              <BlogCard
                key={post._id || index}
                title={post.title}
                content={post.content}
                date={post.createdAt || "April 26, 2025"}
                image={
                  post.thumbnail ||
                  "https://img.freepik.com/premium-vector/blog-typographic-header-concept_277904-6681.jpg?uid=R80683717&ga=GA1.1.438306079.1741693645&semt=ais_hybrid&w=740"
                }
                postLink={`/post/${post._id}`}
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
