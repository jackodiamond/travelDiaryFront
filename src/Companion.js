import React, { useState, useEffect, useContext } from 'react';
import './Companion.css'; 
import UserContext from './UserContext';
import TopNav from './TopNav';
import OnlineUsersContext from './OnlineUsersContext';
import config from './Config';

const Companion = () => {
  const { username } = useContext(UserContext);
  const { onlineUsers } = useContext(OnlineUsersContext);
  const [usersWithConversation, setUsersWithConversation] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]); 
  const [conversationVisible, setConversationVisible] = useState(false); // State to control conversation visibility

  // Fetch list of users with whom the current user has had conversations
  useEffect(() => {
    const fetchUsersWithConversation = async () => {
      try {
        const response = await fetch(config.apiUrl+`messages/companions/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUsersWithConversation(data.users);
        } else {
          console.error('Failed to fetch users with conversation:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users with conversation:', error);
      }
    };

    fetchUsersWithConversation();
  }, [username]);

  // Fetch conversation with selected user
  useEffect(() => {
    const fetchConversation = async () => {
      if (selectedUser) {
        try {
          const response = await fetch(config.apiUrl+'messages/messages/' + username + '/' + selectedUser);
          if (response.ok) {
            const data = await response.json();
            setConversation(data.messages);
            setConversationVisible(true); // Show conversation when a user is clicked
          } else {
            console.error('Failed to fetch conversation:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching conversation:', error);
        }
      }
    };

    fetchConversation();
  }, [username, selectedUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
     <TopNav showImageIcon={false} />
    <div className="companion-page">    
      <div className="user-list">
        <h2>Conversations</h2>
        <ul>
          {usersWithConversation.map((user) => (
            <li key={user} onClick={() => handleUserClick(user)} className={`user-list-item ${selectedUser === user ? 'selected' : ''}`}>
              <span>{user}</span> <span className={onlineUsers.includes(user) ? "online" : "offline"}>{onlineUsers.includes(user) ? "Online" : "Offline"}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`conversation-container ${conversationVisible ? 'visible' : ''}`}>
        <div className="conversation">
          <h2>Conversation</h2>
          <ul>
            {conversation.map((message, index) => (
              <li key={message._id} className={`message ${index % 2 === 0 ? 'even' : 'odd'}`}>
                <div className="username">{message.message.sender}</div>
                <div className="message-text">{message.message.message}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="input-container">
          <input type="text" placeholder="Type your message..." />
          <button>Send</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Companion;
