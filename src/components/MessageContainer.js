import React, { useEffect, useRef, useState } from "react";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import LiveHelp from "@mui/icons-material/LiveHelp";
import { useChannel } from "../contexts/ChannelContext";
import { useMessage } from "../contexts/MessageContext";

const MessageContainer = ({ channel }) => {
  const endOfMessagesRef = useRef(null);
  const { channels, joinChannel } = useChannel();
  const { messages, fetchMessagesByChannelId, sendMessageToChannel } =
    useMessage();
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const selectedChannel = channels.find((ch) => ch._id === channel._id);

  const handleSendMessage = async () => {
    await sendMessageToChannel(selectedChannel._id, newMessage);
    fetchMessagesByChannelId(selectedChannel._id);
    setFetchedMessages(messages);
    setNewMessage("");
  };

  const handleJoinChannel = () => {
    joinChannel(channel._id);
    console.log("MESSAGES", messages, selectedChannel);
    setFetchedMessages(messages);
  };

  useEffect(() => {
    if (selectedChannel.has_joined) {
      fetchMessagesByChannelId(selectedChannel._id);
      setFetchedMessages(messages);
    } else {
      console.log("ABC", channel._id);
      setFetchedMessages([]);
    }
  }, [selectedChannel]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box>
        <Box
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            height: "720px",
            overflow: "auto",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent: msg.is_mine ? "end" : "start",
              }}
            >
              {!msg.is_mine ? (
                <Box
                  sx={(theme) => ({
                    width: "40px",
                    height: "40px",
                    backgroundColor: theme.palette.grey[500],
                    borderRadius: "50%",
                    color: "whitesmoke",
                    display: "flex",
                    justifyContent: "center",
                    marginRight: 2,
                    alignItems: "center",
                  })}
                >
                  {msg.sender.username[0]}
                </Box>
              ) : (
                <></>
              )}
              <Box
                sx={(theme) => ({
                  backgroundColor: msg.is_mine
                    ? "#dcf8c6"
                    : theme.palette.grey[300],
                  // padding: 2,
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingLeft: 1,
                  paddingRight: 1,
                  borderRadius: 2,
                  maxWidth: "70%",
                  wordBreak: "break-word",
                })}
              >
                {!msg.is_mine && msg.sender.username}
                <Typography
                  sx={{
                    paddingLeft: 1,
                    paddingRight: 2,
                    backgroundColor: !msg.is_mine ? "white" : "",
                    borderRadius: 1,
                    marginTop: 1,
                  }}
                >
                  {msg.content}
                </Typography>
              </Box>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
      </Box>
      {selectedChannel.has_joined ? (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{ height: "56px" }}
          >
            Send
          </Button>
        </Box>
      ) : (
        <>
          {!selectedChannel.has_joined && (
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
                  You haven't joined this channel
                </Typography>
                <Typography
                  fontSize={14}
                  color={"#8a8a8a"}
                  textAlign={"center"}
                >
                  {channel.users.length} users already joined the channel
                </Typography>
                <Typography mt={8} textAlign={"center"}>
                  Do you want to join the channel?
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleJoinChannel}
                    sx={{ width: "200px" }}
                  >
                    Join
                  </Button>
                </Box>
              </Box>
            </div>
          )}
        </>
      )}
    </Box>
  );
};

export default MessageContainer;
