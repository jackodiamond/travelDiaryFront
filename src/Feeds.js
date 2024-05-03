import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector hook from react-redux
import Menu from './Menu';
import TopNav from './TopNav';
import FeedCard from './FeedCard';
import AuthenticatedWrapper from './AuthenticatedWrapper'; // Import the AuthenticatedWrapper component
import './feedCard.css'; // Import CSS file for FeedCard component
import config from './Config';

function Feeds() {
  // State to hold the fetched feeds
  const [feeds, setFeeds] = useState([]);
  const [activeMenu, setActiveMenu] = useState('feeds');

  // Redux state for isAuthenticated
  const isAuthenticated = useSelector(state => state.isAuthenticated);

  // Function to fetch feeds by author
  const fetchFeedsByAuthor = async (authorName) => {
    try {
      const response = await fetch(config.apiUrl+`feed/feeds?author=${authorName}`);
      const data = await response.json();
      setFeeds(data);
    } catch (error) { 
      console.error('Error fetching feeds:', error);
    }
  };

  // Fetch all feeds on component mount
  useEffect(() => {
    fetchFeedsByAuthor('');
  }, []); // Empty dependency array to ensure effect runs only once on component mount

  // Function to handle author click
  const handleAuthorClick = (authorName) => {
    fetchFeedsByAuthor(authorName);
  };

  // Render the component
  return (
    <AuthenticatedWrapper >
      <>
        <TopNav  showImageIcon={false} />
        <div className="feeds-container">
          {feeds.map(feed => (
            <FeedCard key={feed._id} feed={feed} />
          ))}
        </div>
      </>
    </AuthenticatedWrapper>
  );
}

export default Feeds;
