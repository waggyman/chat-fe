import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useUser } from "../contexts/UserContext";

const UserList = ({ onSelectUser }) => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const { users } = useUser();

  const handleChannelClick = (user) => {
    setSelectedChannelId(user._id);
    onSelectUser(user);
  };

  return (
    <List sx={{ paddingBottom: 0 }}>
      {users.map((user) => (
        <ListItem key={user._id} disablePadding>
          <ListItemButton
            onClick={() => handleChannelClick(user)}
            sx={{
              backgroundColor:
                user._id === selectedChannelId ? "#e9ecef" : "transparent",
              "&:hover": {
                backgroundColor:
                  user._id === selectedChannelId ? "#e9ecef" : "#f1f1f1",
              },
            }}
          >
            <Box
              sx={(theme) => ({
                width: "40px",
                height: "40px",
                backgroundColor: theme.palette.grey[500],
                borderRadius: "50%",
                marginRight: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "white",
                position: 'relative'
              })}
            >
              A
              <Box sx={(theme) => ({ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: (user.is_online) ? '#41d347' : theme.palette.grey[300], position: 'absolute', bottom: '3px', right: '0', border: (!user.is_online) ? 'solid white 0.5px' : 'none'})} />
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'justify-between', alignItems: 'center'}}>
                <Box>
                    <Typography>
                        {user.username}
                    </Typography>
                    <Typography fontSize={14}>
                        {user.email}
                    </Typography>
                </Box>
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
