import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import formatDate from "../../utils/formatDate";
import { FiLogOut, FiEdit, FiTrash2 } from "react-icons/fi";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const postsRes = await axios.get(
        "http://localhost:3000/api/user/get-posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPosts(postsRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch dashboard data.");
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Post deleted successfully!");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete post.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
      <div className="top-bar"></div>

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="buttons">
          <button className="create-btn">
            <Link to="/create">Create New Post</Link>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={21} />
            <span className="logout-text"></span>
          </button>
        </div>
      </div>

      <div className="posts-table">
        <h2>All Posts</h2>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.author?.name || "Admin User"}</td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td className="actions">
                    <button onClick={() => navigate(`/update/${post._id}`)}>
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(post._id)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
