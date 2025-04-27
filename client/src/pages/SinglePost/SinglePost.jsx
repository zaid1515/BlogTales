import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import formatDate from "../../utils/formatDate";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import "./singlepost.css";

const SinglePost = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const readTime = queryParams.get("readTime");
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const role=localStorage.getItem('role')

  useEffect(() => {
    setIsLoading(true);
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3000/api/user/get-post/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data?.data) {
          setPost(data.data);
          toast.success("Post loaded successfully!");
        } else {
          toast.error("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Error fetching the post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, readTime]);

  if (!post) {
    return (
      <div className="singlepost-page">
        <p className="singlepost-status">Post not found.</p>
      </div>
    );
  }

  return (
    <div className="singlepost-page">
      <header className="singlepost-header">
        <Link to="/" className="back-button">
          <IoArrowBack size={24} /> Back to Blogs
        </Link>
        <h1>{post.title}</h1>
        <p>
          {formatDate(post.createdAt)} &bull; {readTime}
        </p>
        {role === "admin" && (
          <Link to="/dashboard" className="back-button back-button-dash">
            <IoArrowBack size={24} />
            Back to Dashboard
          </Link>
        )}
      </header>

      {isLoading ? (
        <h2>Loading..</h2>
      ) : (
        post.thumbnail && (
          <div className="singlepost-image">
            <img src={post.thumbnail} alt={post.title} />
          </div>
        )
      )}

      <div className="singlepost-content">
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default SinglePost;
