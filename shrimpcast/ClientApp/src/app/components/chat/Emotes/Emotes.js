import React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Avatar, Box, IconButton, Paper, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
const EmotesWrapper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  bottom: "65px",
  width: "100%",
  backgroundColor: theme.palette.primary[900],
  zIndex: 1,
}));

const EmotesGrid = styled(Box)(({ theme }) => ({
  marginTop: "3px",
  maxHeight: "200px",
  padding: "7.5px",
  overflowY: "auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
  gap: "5px",

  // Custom scrollbar styling
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.primary[800],
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.secondary.main,
    borderRadius: "4px",
  },
}));

const EmoteButton = styled(IconButton)(({ theme }) => ({
  padding: "4px",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const EmoteAvatar = styled(Avatar)({
  borderRadius: 0,
  width: "30px",
  height: "30px",
});

const Emotes = ({ emotes, setMessage, inputRef, setEmotes }) => {
  const handleClose = () => setEmotes(false);

  const handleEmoteClick = (emote) => {
    setMessage((prevMessage) => prevMessage + emote);
    handleClose();

    // Focus input after adding emote
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <EmotesWrapper elevation={2}>
        <EmotesGrid className="scrollbar-custom">
          {emotes.map((emote) => (
            <Tooltip key={emote.name} title={emote.name} placement="top">
              <EmoteButton onClick={() => handleEmoteClick(emote.name)}>
                <EmoteAvatar
                  alt={emote.alt || emote.name}
                  src={emote.url}
                  variant="square"
                />
              </EmoteButton>
            </Tooltip>
          ))}
        </EmotesGrid>
      </EmotesWrapper>
    </ClickAwayListener>
  );
};

export default React.memo(Emotes);
