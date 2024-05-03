// Home.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div>
     <Login/>
    </div>
  );
}

export default Home;
