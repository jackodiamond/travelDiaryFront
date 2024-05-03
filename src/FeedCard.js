import React, { useState, useEffect, useRef,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './feedCard.css';
import axios from 'axios';
import UserContext from './UserContext';
import feedImage from './feed.jpg';
import { fetchProfilePicture } from './ProfilePage';
import config from './Config';

function FeedCard({ feed }) {
  const [showReadMore, setShowReadMore] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [likesCount, setLikesCount] = useState(feed.hearts.length);
  const [comments, setComments] = useState(feed.comments);
  const contentRef = useRef(null);
  const navigate = useNavigate();
  const { username } = useContext(UserContext);

  useEffect(() => {
    if (contentRef.current) {
      setShowReadMore(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  }, [feed.content]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("username feed : ",feed.author)
      const data = await fetchProfilePicture(feed.author);
      setProfilePicUrl(data);
    };
    fetchData();
  }, []);

  const handleReadMore = () => {
    setExpanded(!expanded);
  };

  const handleLike = () => {
    axios.post(config.apiUrl+`feed/like/${feed._id}`, {
      username: username // Replace with actual username
    })
      .then(response => {
        if (response.status === 200) {
          console.log("response : ", response.data.liked);
          if(response.data.liked)
          {
            setLikesCount(likesCount+1);
          }else
          {
            setLikesCount(likesCount-1);
          }
        } else {
          // Handle error
        }
      })
      .catch(error => {
        console.error('Error liking feed:', error);
      });
  };

  const handleComment = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handlePostComment = () => {
    axios.post(config.apiUrl+`feed/comment/${feed._id}`, {
      username: username, // Replace with actual username
      comment: commentInput
    })
      .then(response => {
        if (response.status === 200) {
          setComments([...comments, { username: username, comment: commentInput }]);
          setCommentInput('');
       //   setShowCommentInput(false);
        } else {
          // Handle error
        }
      })
      .catch(error => {
        console.error('Error posting comment:', error);
      });
  };

  const handleAuthorClick = (authorName) => {
    console.log("authorname : ",authorName)
    navigate('/profile', { state: authorName });
  };

  return (
    <div className={`feed-card ${expanded ? 'expanded' : ''}`}>
       {feed.imageUrl && (
      <div className="feed-card-left">
        <img src={feed.imageUrl ? feed.imageUrl : feedImage} alt="Feed" className="feed-image" />
      </div>
      )}
      <div className="feed-card-right"> 
        <h4 className="feed-author" onClick={() => handleAuthorClick(feed.author)}>
          <div className="feed-circle">
            <img src= {profilePicUrl}  className="circle-image" />
          </div>
          <div className="author-name">{feed.author}</div>
        </h4>
        <h2 className="feed-title">{feed.title}</h2>
        <p ref={contentRef} className={`feed-text ${expanded ? 'expanded' : ''}`}>{feed.content}</p>
        {showReadMore && (
          <button className="readMore-button" onClick={handleReadMore}>
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
        <div className="feed-buttons">
          <button className="like-button" onClick={handleLike}>{likesCount} Like</button>
          <button className="comment-button" onClick={handleComment}>{comments.length} Comment</button>
        </div>
        {showCommentInput && (
          <div className="comment-section">
            <div className="comments">
           {comments.map((comment, index) => (
             <div key={index} className="comment">
               <span className="comment-author">{comment.username}:</span>
               <span className="comment-text">{comment.comment}</span>
             </div>
           ))}
         </div>
            <input
              className = "comment-input-input"
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button className = "comment-input-button" onClick={handlePostComment}>Post</button>
          </div>
        )}
       
      </div>
    </div>
  );
}

export default FeedCard;
