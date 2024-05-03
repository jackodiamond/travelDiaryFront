// Messenger.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Messenger = ({ currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up event listener when component unmounts
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Send message to the server
      socket.emit('message', { recipient: currentUser, message });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Messenger</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.sender}: {msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Messenger;
