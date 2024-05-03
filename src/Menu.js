import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch hook
import { disconnectSocket } from './SocketConnection';

function Menu({ activeMenu, setActiveMenu }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch hook

  const handleClick = (menu) => {
    setActiveMenu(menu);
    console.log("handle click called ", menu);
    switch (menu) {
      case 'feeds':
        navigate('/feeds');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'createFeed':
        navigate('/createFeed');
        break;
      case 'companion':
        navigate('/companion');
        break;
      case 'logout':
        // Dispatch the LOGOUT action upon clicking logout
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        disconnectSocket();
        break;
      default:
        break;
    }
  };

  return (
    <div className="menu">
      <button className={`menu-button ${activeMenu === 'feeds' ? 'active' : ''}`} onClick={() => handleClick('feeds')}>Feeds</button>
      <button className={`menu-button ${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => handleClick('profile')}>Profile</button>
      <button className={`menu-button ${activeMenu === 'createFeed' ? 'active' : ''}`} onClick={() => handleClick('createFeed')}>Create Feed</button>
      <button className={`menu-button ${activeMenu === 'companion' ? 'active' : ''}`} onClick={() => handleClick('companion')}>Companion</button>
      <button className="menu-button" onClick={() => handleClick('logout')}>Logout</button>
    </div>
  );
}

export default Menu;
