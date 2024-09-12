import React, { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Typography,
} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import ChannelList from "../components/ChannelList";
import MessageContainer from "../components/MessageContainer";
import UserList from "../components/UserList";
import { TabList, TabPanel } from "@mui/lab";
import { LiveHelp } from "@mui/icons-material";
import socket, { setOnline } from "../utils/websocket";
import { useAuth } from "../contexts/AuthContext";
import { useMessage } from "../contexts/MessageContext";
import { useChannel } from "../contexts/ChannelContext";

const Home = () => {
  const { user } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState();
  const [selectedUser, setSelectedUser] = useState();

  const { fetchMessagesByChannelId, fetchMessagesByReceiverId } = useMessage();
  const { activeChannel, setActiveChannel } = useChannel();
  const [value, setValue] = useState('channels');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setOnline(user._id);
  }, []);

  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    setSelectedUser();
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedChannel()
  }

  useEffect(() => {
    const handleMessage = (data) => {
      if (selectedUser) {
        if ((data.message.sender === selectedUser._id && data.message.receiver === user._id)) {
          fetchMessagesByReceiverId(data.message.sender);
        }
        if ((data.message.receiver === selectedUser._id && data.message.sender === user._id)) {
          fetchMessagesByReceiverId(data.message.receiver);
        }
      }
    };
  
    socket.on('sendDirectMessage', handleMessage);
    return () => {
      socket.off('sendDirectMessage', handleMessage);
    };
  }, [selectedUser])

  useEffect(() => {
    const handleMessage = (data) => {
      if (selectedChannel) {
        if (data.channelId === selectedChannel._id) {
          fetchMessagesByChannelId(data.channelId);
        }
      }
    };
  
    socket.on('sendChannelMessage', handleMessage);
    return () => {
      socket.off('sendChannelMessage', handleMessage);
    };
  }, [selectedChannel])

  return (
    <div style={{marginTop: 20, backgroundColor: 'white'}}>
      <Box
        sx={{
          display: "flex",
          height: 800
        }}
      >
        <Box
          sx={(theme) => ({
            width: "400px",
            border: "0.5px solid",
            borderColor: theme.palette.grey[300],
          })}
        >
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" variant="fullWidth">
                <Tab label="Channels" value="channels" />
                <Tab label="Users" value="users" />
              </TabList>
            </Box>
            <TabPanel value="channels" sx={(theme) => ({
              padding: 0
            })}>
              <ChannelList onSelectChannel={(channel) => handleSelectChannel((channel))} />
            </TabPanel>
            <TabPanel value="users"  sx={(theme) => ({
              padding: 0
            })}>
              <UserList onSelectUser={(user) => handleSelectUser(user)} />
            </TabPanel>
          </TabContext>
        </Box>
        <Box
          sx={(theme) => ({
            flexGrow: 1,
            borderBottom: "0.5px solid",
            borderRight: "0.5px solid",
            borderTop: "0.5px solid",
            borderColor: theme.palette.grey[300],
          })}
        >
          {selectedChannel ? (
            <MessageContainer type="channels" data={selectedChannel} key={selectedChannel._id} />
          ) : (
            <>
              {selectedUser ? (
                <MessageContainer type="users" data={selectedUser} key={selectedUser._id} />
              ) : (
                <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "300px" }}>
                  <Typography textAlign={"center"} sx={{ marginBottom: 2 }}>
                    <LiveHelp sx={{ fontSize: "40px" }} />
                  </Typography>
                  <Typography fontSize={18} textAlign={"center"}>
                    Select { value === 'channels' ? 'Channel' : 'User' } to start messaging
                  </Typography>
                </Box>
              </div>
              )}
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Home;
