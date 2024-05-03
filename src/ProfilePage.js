import React, { useContext, useState, useEffect, useRef } from 'react';
import './ProfilePage.css'; // Import CSS file for styling
import TopNav from './TopNav';
import AuthenticatedWrapper from './AuthenticatedWrapper';
import UserContext from './UserContext';
import FeedCard from './FeedCard';
import axios from 'axios'; // Import Axios for making HTTP requests
import BioEditModal from './BioEditModal'; // Import the BioEditModal component
import { useLocation } from 'react-router-dom';
import './MessagingComponent.css';
import MessagingComponent from './MessagingComponent';
import MyComponent from './SocketConnection';
import SocketConnection from './SocketConnection';
import config from './Config';


function ProfilePage({ user }) {
  const location = useLocation(); // Get location object from react-router-dom
  const authorName = location.state; // Access authorName from state

  const [feeds, setFeeds] = useState([]);
  const {username } = useContext(UserContext);
  const [formData, setFormData] = useState({ image: null });
  const [profileData, setProfileData] = useState(null);
  const [isMounted, setIsMounted] = useState(true); // Track if component is mounted
  const [showBioModal, setShowBioModal] = useState(false); // Track if bio modal is visible
  const [newBio, setNewBio] = useState(''); // Track the new bio input
  const [coverPic, setCoverPic] = useState('');
  const userNameRef = useRef(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    console.log("author name ", authorName);
    if(authorName==null)
    {
      console.log("1 author name ",username)
      userNameRef.current = username;
    }else
    {
      console.log("2 author name ",authorName)
      userNameRef.current = authorName;
    }
    console.log("username set to ",userNameRef.current)
    fetchFeedsByAuthor(userNameRef.current);
  }, []); // Empty dependency array to ensure effect runs only once on component mount

  useEffect(() => {
    console.log("use effect 1 ",username)
    setIsMounted(true); // Set to true when component mounts
 
    fetchProfileData();

    // Cleanup function to set isMounted to false when component unmounts
    return () => {
      setIsMounted(false);
    };
  }, [username, isMounted]); // Add isMounted to dependency array

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(config.apiUrl+`profile/getprofile/`+userNameRef.current);
      if(response.data)
      {
        setProfileData(response.data);
        setFormData({image:response.data.profilePic});
        console.log("profile pic rsponse ",response.data.profilePic)
        setCoverPic(response.data.coverPic);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };




  // Function to handle opening the bio edit modal
  const handleEditBio = () => {
    setShowBioModal(true);
    setNewBio(profileData?.bio || ''); // Set newBio to current bio, if available
  };

  // Function to handle closing the bio edit modal
  const handleCloseBioModal = () => {
    setShowBioModal(false);
  };

  // Function to handle updating the bio
  const handleUpdateBio = async (updatedBio) => {
    try {
      // Call the PUT API to update the bio
      await axios.put(config.apiUrl+`profile/updateProfile/`+userNameRef.current, { bio: updatedBio });
      // Update the profile data with the new bio
      console.log("bio update sent!")
      setProfileData(prevData => ({ ...prevData, bio: updatedBio }));
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

   // Function to handle updating the bio
   const handleUpdateProfilePicServer = async (updatedPic) => {
    try {
      // Call the PUT API to update the bio
      await axios.put(config.apiUrl+`profile/updateProfile/`+userNameRef.current, { profilePic: updatedPic });
      // Update the profile data with the new bio
      console.log("bio update sent! ")
      setProfileData(prevData => ({ ...prevData, profilePic: updatedPic }));
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleUpdateProfilePic = (event) => {
    console.log("handle update profile pic?")
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = () => {
        setFormData({
          image: reader.result, // Set uploaded image data to state
        });
        handleUpdateProfilePicServer(reader.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const [openMessagingComponents, setOpenMessagingComponents] = useState([]);

  const openMessaging = () => {
    const newId = Date.now(); // Generate a unique ID for the messaging component
    setOpenMessagingComponents([...openMessagingComponents, newId]);
  };

  const closeMessaging = (id) => {
    setOpenMessagingComponents(openMessagingComponents.filter((compId) => compId !== id));
  };


  return (
    <AuthenticatedWrapper>
      <>
      
       {loading ? (
         <TopNav
         
         showCoverPic={true}
         showImageIcon={true}
       />
      ) : (
        <TopNav
          coverPicPath={coverPic}
          showCoverPic={true}
          showImageIcon={true}
        />
      )}
      
        <div className="profile-container">
          <div className="profile-info">
            <div className="profile-pic-container">
              {/* Use profile data if available, otherwise use default */}
              <img src= {formData.image ? formData.image : '/icon/profilePic.jpg'}  alt="Profile" className="profile-pic" />
              <div className="profile-name">{userNameRef.current}</div>
              {/* Edit icon for profile picture */}
      
              <label htmlFor="image-upload" className="placeholder-image-label">
              {authorName == null && (
              <img src="/icon/edit-image-icon.png"  className="edit-icon" type="file" accept="image/*" id="upload-input"/>
              )}
              </label>
              {/* Hidden file input */}
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleUpdateProfilePic}
                style={{ display: 'none' }}
              />

            </div>
            <div className="bio">
              {/* Display bio or edit mode */}
              <>
                {profileData?.bio || (
                  <> 
                    My happy place is anywhere with a horizon.
                  </>
                )}
                {/* Edit icon for bio */}
                {authorName == null && (
                <img src="/icon/writing-icon.png" alt="Edit" className="edit-icon-bio" onClick={handleEditBio} />
                )}
              </>
            </div>
            {authorName != null && (
            <div className="friend-buttons">
            <button className="friend-button">add friend</button>
            <button className="friend-button" onClick={openMessaging}>message</button>
            </div>
            )}
          </div>
        </div>
        <div className="feeds-container">
          {feeds.map(feed => (
            <FeedCard key={feed._id} feed={feed} />
          ))}
        </div>
        {showBioModal && (
          <BioEditModal
            onClose={handleCloseBioModal}
            onUpdate={handleUpdateBio}
            initialBio={newBio}
          />
        )}

      {openMessagingComponents.map((id) => (
        <MessagingComponent key={id} senderName={username} recipientName={userNameRef.current} onClose={() => closeMessaging(id)} />
      ))} 
      </>
    </AuthenticatedWrapper>
  );
}

const fetchProfilePicture = async (user) => {
  try {
    const response = await axios.get(`http://127.0.0.1:3000/profile/getprofile/`+user);
    if(response.data)
    {
      return response.data.profilePic;
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
  }
};

export {fetchProfilePicture};
export default ProfilePage; 