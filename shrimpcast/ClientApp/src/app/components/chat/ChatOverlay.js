import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import TokenManager from "../../managers/TokenManager";
import SignalRManager from "../../managers/SignalRManager";
import LocalStorageManager from "../../managers/LocalStorageManager";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  messagesContainer: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    padding: "10px",
    boxSizing: "border-box",
  },
  messageBase: {
    margin: "4px 0",
    padding: "3px",
    borderRadius: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
  },
  userName: {
    fontWeight: "bold",
    display: "inline",
    marginRight: "5px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
  },
  messageText: {
    display: "inline",
    wordBreak: "break-word",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
  },
  systemMessage: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#aaa",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
  },
  emote: {
    verticalAlign: "middle",
    margin: "0 2px",
    height: "40px",
  },
  iconStyle: {
    fontSize: "13px",
    position: "relative",
    top: "1.2px",
    marginRight: "2px",
  },
  colonStyle: {
    display: "inline",
    color: "white",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)",
  },
};

const ChatOverlay = () => {
  const [loading, setLoading] = useState(true);
  const [signalR, setSignalR] = useState({});
  const [connectionData, setConnectionData] = useState({});
  const [messages, setMessages] = useState([]);

  const scrollReference = useRef();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Simple URL parameters
  const fontSize = params.get("fontSize") || "15px";
  const opacity = params.get("opacity") || "0.5";
  const messageColor = params.get("color") || "white";

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollReference.current) {
      scrollReference.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to replace emotes in text
  const replaceEmotes = (content) => {
    if (!connectionData.emotes || !content) return content;

    const emoteNames = connectionData.emotes.map(e => e.name).join('|');
    if (!emoteNames) return content;

    const parts = content.split(new RegExp(`(${emoteNames})`, 'g'));

    return parts.map((part, index) => {
      const emote = connectionData.emotes.find(e => e.name === part);
      if (emote) {
        return (
          <img
            key={index}
            src={emote.url}
            alt={emote.name}
            style={styles.emote}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Handle new messages
  const handleNewMessage = (message) => {
    setMessages(existingMessages => {
      // Skip hidden or empty messages
      if (message.hidden || (!message.content && message.messageType !== "MessageRemoved")) {
        return existingMessages;
      }

      // Skip ignored users
      if (message.sessionId &&
          !message.isAdmin &&
          !message.isMod &&
          LocalStorageManager.getIgnoredUsers().some(user => user.sessionId === message.sessionId)) {
        return existingMessages;
      }

      // Handle message removal
      if (message.messageType === "MessageRemoved") {
        return existingMessages.filter(m => m.messageId !== message.messageId);
      }

      // Handle user banned, name changes, and color changes
      const isBannedType = message.messageType === "UserBanned";
      const isNameChangedType = message.messageType === "NameChange";
      const isNameColourChangedType = message.messageType === "UserColourChange";

      if (isBannedType || isNameChangedType || isNameColourChangedType) {
        const updatedMessages = [...existingMessages];

        updatedMessages.forEach(m => {
          if (m.sessionId === message.sessionId) {
            if (isBannedType) {
              m.hidden = true;
            }
            if (isNameChangedType) {
              m.sentBy = message.sentBy;
            }
            if (isNameColourChangedType) {
              const { content } = message;
              const isModAdded = content === "ModAdded";
              const isModRemoved = content === "ModRemoved";
              const isGoldenAdded = content === "GoldenAdded";

              if (isModAdded) m.isMod = true;
              else if (isModRemoved) m.isMod = false;
              else if (isGoldenAdded) m.isGolden = true;
              else m.userColorDisplay = content;
            }
          }
        });

        return updatedMessages.filter(m => !m.hidden);
      }

      // Add new message
      return [...existingMessages, message];
    });
  };

  // Connect to SignalR
  useEffect(() => {
    // Apply transparent background to body
    document.body.style.backgroundColor = 'transparent';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';

    const connectSignalR = async (abortControllerSignal) => {
      if (!loading) return;
      const response = await TokenManager.EnsureTokenExists(abortControllerSignal, {});
      if (abortControllerSignal.aborted) return;

      setConnectionData(response);

      if (response.message) {
        setLoading(false);
        return;
      }

      const newConnection = await SignalRManager.connect();
      newConnection.on(SignalRManager.events.messageReceived, handleNewMessage);

      setSignalR(newConnection);
      setLoading(false);
    };

    const abortController = new AbortController();
    connectSignalR(abortController.signal);

    return () => {
      abortController.abort();
      if (signalR.off) {
        signalR.off(SignalRManager.events.messageReceived);
      }
    };
  }, [loading, signalR]);

  // Get initial messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch('/api/message/GetExisting');
        if (response.ok) {
          const existingMessages = await response.json();

          // Filter out ignored users
          const ignoredUsers = LocalStorageManager.getIgnoredUsers().map(
            (iu) => iu.sessionId
          );

          const filteredMessages = existingMessages
            .filter(em => em.isAdmin || em.isMod || !ignoredUsers.includes(em.sessionId))
            .filter(em => em.content)
            .reverse();

          setMessages(filteredMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    if (!loading && signalR.invoke) {
      getMessages();
    }
  }, [loading, signalR]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get user color
  const getUserColor = (message) => {
    return message.userColorDisplay || messageColor;
  };

  return (
    <Box sx={styles.container}>
      <Box
        sx={styles.messagesContainer}
      >
        {messages.map(message => (
          <Box
            key={message.messageId || `msg-${Math.random()}`}
            sx={{
              ...styles.messageBase,
              backgroundColor: `rgba(0, 0, 0, ${opacity})`
            }}
          >
            {message.messageType === "UserMessage" ? (
              <>
                <Typography
                  component="span"
                  sx={{
                    ...styles.userName,
                    color: getUserColor(message),
                    fontSize
                  }}
                  className={message.isAdmin ? "admin-glow" : message.isMod ? "mod-glow" : ""}
                >
                  {message.isAdmin && <VerifiedUserIcon sx={styles.iconStyle} />}
                  {message.isMod && <VerifiedUserIcon sx={styles.iconStyle} />}
                  {message.isGolden && <WorkspacePremiumIcon sx={styles.iconStyle} />}
                  {message.sentBy}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    ...styles.colonStyle,
                    fontSize
                  }}
                >
                  {": "}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    ...styles.messageText,
                    color: messageColor,
                    fontSize
                  }}
                >
                  {replaceEmotes(message.content)}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  ...styles.systemMessage,
                  fontSize
                }}
              >
                {message.content}
              </Typography>
            )}
          </Box>
        ))}
        <div ref={scrollReference}></div>
      </Box>
    </Box>
  );
};

export default ChatOverlay;
