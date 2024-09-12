import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TagIcon from "@mui/icons-material/Tag";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useChannel } from "../contexts/ChannelContext";
import { useMessage } from "../contexts/MessageContext";

const ChannelList = ({ onSelectChannel }) => {
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [newChannelName, setNewChannelName] = useState("");
  const [open, setOpen] = useState(false);
  const [modalErrorMessage, setModalErroMessage] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { token } = useAuth();
  const { channels, createChannel, setActiveChannel } = useChannel();
  const { setMessages } = useMessage();

  const handleCreateChannel = async () => {
    if (newChannelName.trim().length) {
      const foundChannel = channels.find(
        (channel) => channel.name === newChannelName
      );
      if (foundChannel) {
        setModalErroMessage(`Channel name ${newChannelName} is already exist`);
      } else {
        setModalErroMessage("");
        await createChannel(newChannelName.trim());
        setOpen(false);
      }
    }
  };
  const handleChannelClick = (channel) => {
    setSelectedChannelId(channel._id);
    setMessages([]);
    onSelectChannel(channel);
  };

  useEffect(() => {
    if (modalErrorMessage) {
      setTimeout(() => {
        setModalErroMessage("");
      }, 5000);
    }
  }, [modalErrorMessage]);

  return (
    <List sx={{ paddingBottom: 0 }}>
      <Box sx={{ paddingLeft: "16px", fontSize: 12, marginBottom: 2 }}>
        My Channels
      </Box>
      {channels
        .filter((channel) => channel.has_joined)
        .map((channel) => (
          <ListItem key={channel._id} disablePadding>
            <ListItemButton
              onClick={() => handleChannelClick(channel)}
              sx={{
                backgroundColor:
                  channel._id === selectedChannelId ? "#e9ecef" : "transparent",
                "&:hover": {
                  backgroundColor:
                    channel._id === selectedChannelId ? "#e9ecef" : "#f1f1f1",
                },
              }}
            >
              <TagIcon
                sx={{ width: "18px", marginTop: "3px" }}
                style={{ transform: "rotate(15deg)" }}
              />
              <ListItemText sx={{ marginLeft: 1 }} primary={channel.name} />
            </ListItemButton>
          </ListItem>
        ))}
      <Divider />
      {channels.filter((channel) => !channel.has_joined).length ? (
        <Box
          sx={{
            paddingLeft: "16px",
            fontSize: 12,
            marginBottom: 2,
            marginTop: 2,
          }}
        >
          Not joined
        </Box>
      ) : <></>}

      {channels
        .filter((channel) => !channel.has_joined)
        .map((channel) => (
          <ListItem key={`not-joined-${channel._id}`} disablePadding>
            <ListItemButton
              onClick={() => handleChannelClick(channel)}
              sx={{
                backgroundColor:
                  channel._id === selectedChannelId ? "#e9ecef" : "transparent",
                "&:hover": {
                  backgroundColor:
                    channel._id === selectedChannelId ? "#e9ecef" : "#f1f1f1",
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <TagIcon
                sx={{ width: "18px", marginTop: "3px" }}
                style={{ transform: "rotate(15deg)" }}
              />
              <ListItemText
                sx={{ marginLeft: 1 }}
                primary={`${channel.name}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleOpen}
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            marginTop: 2,
            borderTop: "solid 0.5px",
            borderColor: theme.palette.grey[300],
            border: `${theme.palette.grey[300]} solid 0.5px`,
            "&:hover": { backgroundColor: theme.palette.grey[300] },
          })}
        >
          <p style={{ marginTop: 2, marginBottom: 2 }}>Create Channel</p>
          <AddIcon />
          {/* <ListItemText>Create Channel</ListItemText> */}
        </ListItemButton>
      </ListItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography textAlign={"center"} id="modal-modal-title" variant="h6">
            Create new channel
          </Typography>
          <Typography
            color={"#797979"}
            fontSize={13}
            textAlign={"center"}
            id="modal-modal-title2"
          >
            Channels are where conversations happen around a topic. Use a name
            that is easy to find and understand.
          </Typography>
          {modalErrorMessage ? (
            <Alert sx={{ mt: 2 }} severity="error">
              {modalErrorMessage}
            </Alert>
          ) : (
            <></>
          )}
          <TextField
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            sx={{ width: "100%", mt: 4 }}
            placeholder="Channel Name"
            variant="outlined"
          />
          <Button
            disabled={!newChannelName.trim().length}
            variant="contained"
            onClick={handleCreateChannel}
            sx={{ width: "100%", mt: 2 }}
          >
            Create
          </Button>
        </Box>
      </Modal>
    </List>
  );
};

export default ChannelList;
