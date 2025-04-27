import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import './App.css';
import Blogs from './pages/Blogs/Blogs';
import CreatePost from './pages/CreatePost/CreatePost';
import UpdatePost from './pages/CreatePost/UpdatePost';
import SinglePost from './pages/SinglePost/SinglePost';
import Dashboard from './pages/Dashboard/Dashboard';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


function App() {
  const token=localStorage.getItem('token')

  return (
    <Router>
      <Routes>
        <Route path="/register" element={token?<Navigate to="/" replace /> :<Register />} />
        <Route path="/login" element={token?<Navigate to="/" replace /> :<Login/>} />

        <Route path="/" element={<Blogs />} />
        <Route path="/post/:id" element={<SinglePost />} />
        

        <Route path="/create/" element={<PrivateRoute element={<CreatePost />} requiredRole={'admin'}/>}/>
        <Route path="/update/:postId" element={<PrivateRoute element={<UpdatePost />} requiredRole={'admin'}/>} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole={'admin'}/> } />
      </Routes>
    </Router>
  );
}

export default App;
