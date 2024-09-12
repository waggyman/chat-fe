import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const users = [
  { id: '1', name: 'Arigi' },
  { id: '2', name: 'Arigi2' },
  { id: '3', name: 'Arigi3' },
];

const UserList = ({ onSelectChannel }) => {
    const [selectedChannelId, setSelectedChannelId] = useState(null);

  const handleChannelClick = (channel) => {
    setSelectedChannelId(channel.id);
    onSelectChannel(channel);
  };
  return (
    <List sx={{paddingBottom: 0}}>
      {users.map((channel) => (
        <ListItem key={channel.id} disablePadding>
          <ListItemButton
            onClick={() => handleChannelClick(channel)}
            sx={{
              backgroundColor: channel.id === selectedChannelId ? '#e9ecef' : 'transparent',
              '&:hover': {
                backgroundColor: channel.id === selectedChannelId ? '#e9ecef' : '#f1f1f1',
              },
            }}
          >
            <Box sx={(theme) => ({ width: '30px', height: '30px', backgroundColor: theme.palette.grey[500], borderRadius: '50%', marginRight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',fontSize: '12px', color: 'white'})}>
                A
            </Box>
            <ListItemText primary={channel.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;