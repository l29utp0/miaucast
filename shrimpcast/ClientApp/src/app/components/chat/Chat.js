import { Box } from "@mui/material";
import React, { useState } from "react";
import ConnectedUsersCount from "./ConnectedUsersCount";
import RenderChatMessages from "./RenderChatMessages";
import ChatTextField from "./ChatTextField";
import ActivePoll from "./ActivePoll";
import ActiveBingo from "./ActiveBingo";
import GoldenPassButton from "./GoldenPass/GoldenPassButton";

const ChatSx = {
  height: "100%",
  position: "relative",
};

const Chat = (props) => {
  const [autoScroll, toggleAutoScroll] = useState(true);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [message, setMessage] = useState("");
  const [bingoButtonExpanded, setBingoButtonExpanded] = useState(true);
  const [goldenPassExpanded, setGoldenPassExpanded] = useState(true);

  return (
    <Box sx={ChatSx}>
      <ConnectedUsersCount {...props} />
      <ActivePoll {...props} goldenPassExpanded={goldenPassExpanded} />
      <RenderChatMessages
        autoScroll={autoScroll}
        setNameSuggestions={setNameSuggestions}
        bingoButtonExpanded={bingoButtonExpanded}
        goldenPassExpanded={goldenPassExpanded}
        setMessage={setMessage} // Pass setMessage to RenderChatMessages
        {...props}
      />
      <ActiveBingo
        {...props}
        bingoButtonExpanded={bingoButtonExpanded}
        setBingoButtonExpanded={setBingoButtonExpanded}
      />
      <ChatTextField
        autoScroll={autoScroll}
        toggleAutoScroll={toggleAutoScroll}
        nameSuggestions={nameSuggestions}
        message={message}
        setMessage={setMessage}
        {...props}
      />
      <GoldenPassButton
        {...props}
        goldenPassExpanded={goldenPassExpanded}
        setGoldenPassExpanded={setGoldenPassExpanded}
      />
    </Box>
  );
};

export default Chat;
