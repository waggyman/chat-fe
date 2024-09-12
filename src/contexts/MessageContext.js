import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Import the AuthContext to access the token

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const { token } = useAuth();

  const fetchMessagesByChannelId = async (channelId) => {
    if (!token) return;
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/channels/${channelId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setMessages(response.data.data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
  }

  const sendMessageToChannel = async (channelId, message) => {
    // callAPI
    if (!token) return;
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/channels/${channelId}/send-message`, { content: message }, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        // setMessages(response.data.data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    // await fetchMessagesByChannelId(channelId);
  }

  return (
    <MessageContext.Provider value={{ messages, fetchMessagesByChannelId, sendMessageToChannel, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};