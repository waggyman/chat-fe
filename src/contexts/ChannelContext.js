import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access the token
import { useMessage } from "./MessageContext";

const ChannelContext = createContext();

export const useChannel = () => useContext(ChannelContext);

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const { token } = useAuth();
  const { fetchMessagesByChannelId } = useMessage();

  const fetchChannels = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/channels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setChannels(response.data.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [token]);

  const joinChannel = async (channelId) => {
    if (!token) return;

    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel._id === channelId ? { ...channel, has_joined: true } : channel
      )
    );
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/channels/${channelId}/join`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchMessagesByChannelId(channelId);
  };

  const createChannel = async (name) => {
    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/channels/create`,
        {
            name
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchChannels()
  };

  return (
    <ChannelContext.Provider value={{ channels, joinChannel, createChannel, activeChannel, setActiveChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};
