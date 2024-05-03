import React, { useState, useEffect,useContext } from 'react';
import './TopNav.css'; // Import the CSS file where you define styles for TopNav
import Menu from './Menu';
import backgroundImage from './sunset.jpg';
import axios from 'axios'; // Import Axios for making HTTP requests
import UserContext from './UserContext';
import config from './Config';

const TopNav = ({ coverPicPath,showCoverPic, showImageIcon }) => {
  const [feeds, setFeeds] = useState([]);
  const {username } = useContext(UserContext);
  const [activeMenu, setActiveMenu] = useState('feeds');
  const [formData, setFormData] = useState({ image: null });

  if(coverPicPath=="")
  {
    coverPicPath = backgroundImage;
  }

  if (showCoverPic === undefined) {
    // variable is undefined
    showCoverPic = false;
  }
  if (showImageIcon === undefined) {
    // variable is undefined
    showImageIcon=true;
  }

    // Function to handle updating the bio
    const handleUpdateCoverPicServer = async (updatedPic) => {
    try {
      // Call the PUT API to update the bio
      await axios.put(config.apiUrl+`profile/updateProfile/`+username, { coverPic: updatedPic });
      // Update the profile data with the new bio
      console.log("bio update sent!")
    //  setProfileData(prevData => ({ ...prevData, profilePic: updatedPic }));
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleUpdateCoverPic = (event) => {
    console.log("handle update cover pic : ",username);
    const file = event.target.files[0];
    if (file) { 
      const reader = new FileReader();
       
      reader.onload = () => {
        setFormData({
          image: reader.result, // Set uploaded image data to state
        });
        handleUpdateCoverPicServer(reader.result)
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <>
      <div className="top-nav" style={{ backgroundImage: showCoverPic ? `url(${coverPicPath})` : `url(${backgroundImage})`, position: 'relative' }}>
        <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <label htmlFor="image-upload-cover" className="placeholder-image-label">
              {showImageIcon && (
              <img src="/icon/edit-image-icon.png"  className="edit-icon-cover-pic" type="file" accept="image/*" id="upload-input-cover"/>
              )}
              </label>
              {/* Hidden file input */}
              <input
                type="file"
                id="image-upload-cover"
                accept="image/*"
                onChange={handleUpdateCoverPic}
                style={{ display: 'none' }}
              />


      </div>
    </>
  );
  
};

export default TopNav;
