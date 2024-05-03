// socketManager.js
import { useContext } from 'react';
import io from 'socket.io-client';
import OnlineUsersContext from './OnlineUsersContext';
import UserContext from './UserContext';

let socket = null;



export const connectSocket = (url,setOnlineUsers) => {
  socket = io(url);

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // Listen for connectedUsersUpdate event
  socket.on('connectedUsersUpdate', (usernames) => {
    // Log all usernames
    console.log('Updated list of connected users:', usernames);
    setOnlineUsers(usernames);
  });
};

export const setUser = (username) => {
  if(socket)
  {
    socket.emit('setUser', username);
  }
};

export const sendMessage = (data) => {
  if(socket)
  {
    socket.emit('message', data);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Disconnected from server');
  }
};
