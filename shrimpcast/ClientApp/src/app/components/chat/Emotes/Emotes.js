import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Avatar, Box, IconButton, Paper } from "@mui/material";

const EmotesWrapperSx = {
    position: "absolute",
    bottom: "65px",
    width: "100%",
    bgcolor: "primary.900",
    zIndex: 1,
  },
  EmotesSx = {
    marginTop: "3px",
    maxHeight: "200px",
    bgcolor: "primary.900",
    padding: "7.5px",
    overflowY: "scroll",
  };

const Emotes = (props) => {
  const handleClose = () => props.setEmotes(false),
    emoteClick = (emote) => {
      props.setMessage((message) => message + emote);
      handleClose();
      // Focus the chat input after adding the emote
      if (props.inputRef?.current) {
        props.inputRef.current.focus();
      }
    };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Paper sx={EmotesWrapperSx} elevation={2}>
        <Box sx={EmotesSx}>
          {props.emotes.map((emote) => (
            <IconButton onClick={() => emoteClick(emote.name)} key={emote.name}>
              <Avatar
                alt={emote.alt}
                sx={{ borderRadius: "0px", width: "30px", height: "30px" }}
                src={emote.url}
              />
            </IconButton>
          ))}
        </Box>
      </Paper>
    </ClickAwayListener>
  );
};

export default Emotes;
