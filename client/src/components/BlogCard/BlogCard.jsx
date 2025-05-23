import React from "react";
import "./BlogCard.css";
import { Link } from "react-router-dom";
import formatDate from "../../utils/formatDate";

function BlogCard({ title, content, date, postLink ,image}) { 

  const readTime=(content)=>{
     const split=content.split(" ")
     return Math.ceil(split.length/150)+" min read"
  }

  return (
    <div className="blog-card">
      <Link to={`${postLink}?readTime=${readTime(content)}`} className="blog-card-link">
        <div className="blog-image-placeholder">
          <img src={image} alt="blog image" />
        </div>
        <div className="blog-content">
          <h2>{title}</h2>
          <div className="blog-footer">
            <span className="blog-date">{formatDate(date)}</span>
            <span className="blog-readtime">{readTime(content)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BlogCard;
