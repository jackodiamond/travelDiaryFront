import React, { useState, useEffect } from 'react';
import './MessagingComponent.css';
import { sendMessage } from './SocketConnection';
import axios from 'axios';
import config from './Config';

const MessagingComponent = ({ senderName, recipientName }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages from server when component mounts
    fetchMessages();
  }, []);

  const toggleMaximized = () => {
    setIsMaximized(!isMaximized);
  };

  const handleInputChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== '') {
      sendMessage({ sender: senderName, recipient: recipientName, message: messageInput });
      setMessageInput(''); // Clear input after sending
      // You may want to refresh messages after sending a new one
      fetchMessages();
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(config.apiUrl+'messages/messages/' + senderName + '/' + recipientName);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        console.log("fetched message ",data.messages);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className={`messaging-component ${isMaximized ? 'maximized' : 'minimized'}`}>
      <div className="toggle-button" onClick={toggleMaximized}>
        {isMaximized ? 'Minimize' : 'Maximize'}
      </div>
      {isMaximized && (
        <div className="maximized-view">
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.sender === senderName ? 'sent' : 'received'}`}
              >
                {message.message.message}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={handleInputChange}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingComponent;
