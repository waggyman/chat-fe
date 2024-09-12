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
import { useUser } from "../contexts/UserContext";

const MessageContainer = ({ data, type }) => {
  const endOfMessagesRef = useRef(null);
  const { channels, joinChannel } = useChannel();
  const { users } = useUser();

  const {
    messages,
    fetchMessagesByChannelId,
    sendMessageToChannel,
    sendDirectMessage,
    fetchMessagesByReceiverId,
  } = useMessage();
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedType, setSelectedType] = useState("channels");

  const selectedData =
    type == "channels"
      ? channels.find((ch) => ch._id === data._id)
      : users.find((u) => u._id === data._id);

  const handleSendMessage = async () => {
    if (type == "channels") {
      await sendMessageToChannel(selectedData._id, newMessage);
      if (selectedData) {
        fetchMessagesByChannelId(selectedData._id);
      }
    } else {
      await sendDirectMessage(selectedData._id, newMessage);
    }

    setNewMessage("");
  };

  const handleJoinChannel = () => {
    joinChannel(data._id);
    setFetchedMessages(messages);
  };

  useEffect(() => {
    setSelectedType(type);
    if (type == "channels" && selectedData) {
      if (selectedData.has_joined) {
        fetchMessagesByChannelId(selectedData._id);
        setFetchedMessages(messages);
      } else {
        setFetchedMessages([]);
      }
    } else {
      fetchMessagesByReceiverId(selectedData._id);
      setFetchedMessages(messages);
    }
  }, [selectedData]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      {type == "channels" ? (
        <>
          {selectedData.has_joined && (
            <Box sx={{ paddingTop: 2 }}>
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
          )}
          {selectedData.has_joined ? (
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
                    {selectedData.users.length} users already joined the channel
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
            </>
          )}
        </>
      ) : (
        <>
          <Box sx={{ paddingTop: 2 }}>
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
        </>
      )}
    </Box>
  );
};

export default MessageContainer;
