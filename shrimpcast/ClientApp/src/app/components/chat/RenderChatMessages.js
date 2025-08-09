import { Box, Button, CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState, useCallback } from "react";
import SystemMessage from "./MessageTypes/SystemMessage";
import MessageManager from "../../managers/MessageManager";
import UserMessage from "./MessageTypes/UserMessage";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SignalRManager from "../../managers/SignalRManager";
import LocalStorageManager from "../../managers/LocalStorageManager";
import ChatActionsManager from "../../managers/ChatActionsManager";
import ComboDisplay from "./ComboDisplay";

const ChatMessagesSx = (
  activePoll,
  activeBingo,
  bingoButtonExpanded,
  showGoldenPassButton,
) => ({
  width: "100%",
  height: `calc(100% - 56px - 28px${activePoll ? " - 35px" : ""}${
    activeBingo ? ` - ${bingoButtonExpanded ? 35 : 10}px` : ""
  }${showGoldenPassButton ? " - 20px" : ""})`,
  overflowY: "scroll",
});

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const NewMessagesToastSx = {
  borderRadius: "2.5px",
  position: "sticky",
  width: "100%",
  textAlign: "center",
  maxHeight: "28px",
  height: "25px",
  display: "flex",
  justifyContent: "center",
  overflow: "hidden",
  bottom: "0",
  zIndex: 10,
};

const RenderChatMessages = React.memo((props) => {
  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mentionSound] = useState(new Audio('/images/noti.mp4'));
  const [currentCombo, setCurrentCombo] = useState({
    emote: null,
    count: 0,
    messageIds: new Set(),
    lastUpdate: 0,
  });

  const {
    signalR,
    configuration,
    bingoButtonExpanded,
    isAdmin,
    isGolden,
    goldenPassExpanded,
    setNameSuggestions,
    enabledSources,
    emotes,
    inputRef,
    setMessage
  } = props;

  const sources = enabledSources.map((source) => `/${source.name}`).join("|");
  const emotesRegex = emotes.map((emote) => emote.name).join("|");
  const scrollReference = useRef();
  const comboTimeoutRef = useRef();

  const scrollToBottom = useCallback(() => {
    if (scrollReference.current) {
      scrollReference.current.scrollIntoView({ behavior: "smooth" });
      setPendingMessages(0);
    }
  }, []);

  const handleNameClick = useCallback(
    (username) => {
      if (inputRef?.current) {
        setMessage((currentMessage) => {
          const newMessage = `${currentMessage}@${username} `;
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              inputRef.current.selectionStart = newMessage.length;
              inputRef.current.selectionEnd = newMessage.length;
            }
          }, 0);
          return newMessage;
        });
      }
    },
    [inputRef, setMessage],
  );

  const handleNewMessage = useCallback(
    (message) => {
      setMessages((existingMessages) => {
        if (
          ChatActionsManager.IsIgnored(
            message.sessionId,
            null,
            message.isAdmin || message.isMod,
          )
        ) {
          return existingMessages;
        }

        let messageList = existingMessages;
        if (message.messageType === "MessageRemoved") {
          let index = messageList.findIndex(
            (m) => m.messageId === message.messageId,
          );
          messageList.splice(index, 1);
        }

        // Add mention sound check
        if (message.messageType === "UserMessage" && message.content) {
          const currentUser = LocalStorageManager.getName();
          const mentionRegex = new RegExp(`@${currentUser}(?=[\\s.]|$)`);

          // Play sound if user is mentioned and message is not from themselves
          if (mentionRegex.test(message.content) && message.sentBy !== currentUser) {
            mentionSound.play().catch(err => console.log('Error playing mention sound:', err));
          }
        }

        const isBannedType = message.messageType === "UserBanned";
        const isNameChangedType = message.messageType === "NameChange";
        const isNameColourChangedType =
          message.messageType === "UserColourChange";

        if (isBannedType || isNameChangedType || isNameColourChangedType) {
          messageList
            .filter((m) => m.sessionId === message.sessionId)
            .forEach((m) => {
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
            });
        }

        // Check for emote combos
        if (message.messageType === "UserMessage" && message.content) {
          // First split by spaces to handle spaced emotes
          const spaceSplit = message.content.trim().split(/\s+/);

          // For each space-separated part, check if it's multiple joined emotes
          const allEmotes = spaceSplit.flatMap((part) => {
            // Find all emote matches in this part (handles cases with no spaces between emotes)
            const matches = props.emotes
              .map((emote) => emote.name)
              .reduce((acc, emoteName) => {
                const regex = new RegExp(emoteName, "g");
                const matches = part.match(regex) || [];
                return [...acc, ...matches];
              }, []);

            return matches;
          });

          // Get unique emotes
          const uniqueEmotes = [...new Set(allEmotes)];

          // If there's exactly one unique emote type
          if (uniqueEmotes.length === 1) {
            const emote = uniqueEmotes[0];

            // Clear existing combo timeout
            if (comboTimeoutRef.current) {
              clearTimeout(comboTimeoutRef.current);
            }

            setCurrentCombo((prev) => {
              if (
                prev.emote === emote &&
                Date.now() - prev.lastUpdate < 20000
              ) {
                prev.messageIds.add(message.messageId);
                return {
                  emote,
                  count: prev.count + 1,
                  messageIds: prev.messageIds,
                  lastUpdate: Date.now(),
                };
              }

              return {
                emote,
                count: 1,
                messageIds: new Set([message.messageId]),
                lastUpdate: Date.now(),
              };
            });

            // Set new timeout to reset combo
            comboTimeoutRef.current = setTimeout(() => {
              setCurrentCombo({
                emote: null,
                count: 0,
                messageIds: new Set(),
                lastUpdate: 0,
              });
            }, 10000);
          } else {
            // Reset combo on non-emote messages
            setCurrentCombo({
              emote: null,
              count: 0,
              messageIds: new Set(),
              lastUpdate: 0,
            });
          }
        }

        if (message.content && !isNameColourChangedType) {
          message.useTransition = true;
          messageList = messageList.concat(message);
        } else {
          messageList = messageList.concat({ hidden: true });
        }

        const maxItems = configuration.maxMessagesToShow;
        if (messageList.length > maxItems) {
          const excessItemsCount = messageList.length - maxItems;
          messageList.splice(0, excessItemsCount);
        }

        return messageList;
      });
    },
    [configuration.maxMessagesToShow, props.emotes, mentionSound],
  );

  const updateNameSuggestions = useCallback(() => {
    setNameSuggestions((existingSuggestions) => {
      const newSuggestions = [
        ...new Set(messages.map((message) => message.sentBy).filter(Boolean)),
      ];
      if (existingSuggestions.length !== newSuggestions.length)
        return newSuggestions;
      for (let i = 0; i < existingSuggestions.length; i++) {
        if (existingSuggestions[i] !== newSuggestions[i]) return newSuggestions;
      }
      return existingSuggestions;
    });
  }, [messages, setNameSuggestions]);

  useEffect(() => {
    const getMessages = async (abortControllerSignal) => {
      if (!loading) return;
      let existingMessages = await MessageManager.GetExistingMessages(
        abortControllerSignal,
      );
      if (abortControllerSignal.aborted) return;
      const ignoredUsers = LocalStorageManager.getIgnoredUsers().map(
        (iu) => iu.sessionId,
      );
      existingMessages = existingMessages.filter(
        (em) => em.isAdmin || em.isMod || !ignoredUsers.includes(em.sessionId),
      );

      existingMessages = existingMessages.reverse();
      setMessages(existingMessages);
      setLoading(false);
    };

    const abortController = new AbortController();
    getMessages(abortController.signal);
    return () => abortController.abort();
  }, [loading]);

  useEffect(() => {
    signalR.on(SignalRManager.events.messageReceived, handleNewMessage);
    return () => {
      signalR.off(SignalRManager.events.messageReceived);
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, [signalR, handleNewMessage]);

  useEffect(() => {
    const lastMessage =
      messages[messages.length ? messages.length - 1 : 0]?.content;
    if (!lastMessage) return;
    if (props.autoScroll) scrollToBottom();
    else setPendingMessages((state) => state + 1);
    updateNameSuggestions();
    if (loading) setLoading(false);
  }, [
    messages,
    props.autoScroll,
    scrollToBottom,
    updateNameSuggestions,
    loading,
  ]);

  return (
    <Box
      sx={ChatMessagesSx(
        configuration.showPoll,
        configuration.showBingo,
        bingoButtonExpanded,
        !isAdmin &&
          !isGolden &&
          configuration.showGoldenPassButton &&
          goldenPassExpanded,
      )}
    >
      {loading && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      {messages.map(
        (message) =>
          !message.hidden &&
          message.content &&
          (message.messageType !== "UserMessage" ? (
            <SystemMessage
              key={message.messageId}
              siteAdmin={props.isAdmin}
              signalR={signalR}
              {...message}
            />
          ) : (
            <UserMessage
              key={message.messageId}
              siteAdmin={props.isAdmin}
              siteMod={props.isMod}
              emotes={props.emotes}
              signalR={signalR}
              enableChristmasTheme={configuration.enableChristmasTheme}
              enableHalloweenTheme={configuration.enableHalloweenTheme}
              userSessionId={props.sessionId}
              maxLengthTruncation={configuration.maxLengthTruncation}
              isComboMessage={currentCombo.messageIds.has(message.messageId)}
              sources={sources}
              enabledSources={enabledSources}
              emotesRegex={emotesRegex}
              onNameClick={handleNameClick}
              {...message}
            />
          )),
      )}
      <Box ref={scrollReference}></Box>
      {pendingMessages > 0 && (
        <Button
          sx={NewMessagesToastSx}
          variant="contained"
          color="success"
          onClick={scrollToBottom}
          endIcon={<ArrowDownwardIcon />}
        >
          {pendingMessages} mensagens novas
        </Button>
      )}
      <ComboDisplay
        combo={currentCombo}
        emotes={emotes}
        setMessage={setMessage}
        inputRef={inputRef}
      />
    </Box>
  );
});

export default RenderChatMessages;
