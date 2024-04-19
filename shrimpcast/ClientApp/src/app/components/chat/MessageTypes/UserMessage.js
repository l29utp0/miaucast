import { Box, IconButton, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import reactStringReplace from "react-string-replace";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import ManageUserDialog from "../ManageUserDialog";
import ConfirmDialog from "../../others/ConfirmDialog";
import MessageWrapper from "./MessageWrapper";

const WrapperTextBoxSx = {
    margin: "10px",
    wordWrap: "break-word",
    padding: "2px",
    position: "relative",
    "&:hover": {
      backgroundColor: "primary.800",
    },
  },
  TextSx = (color, force) => ({
    fontWeight: color || force ? "bold" : "none",
    color: color ? color : "white",
    display: "inline",
    fontSize: "15px",
  }),
  OverlaySx = {
    width: "auto",
    height: "25px",
    position: "absolute",
    right: 0,
    padding: 0,
    borderRadius: "5px",
    display: "flex",
    visibility: "hidden",
    top: "5px",
    zIndex: 2,
  },
  HighlightSx = {
    margin: "2px",
    padding: "2px",
    backgroundColor: "secondary.main",
    color: "black",
    fontSize: "15px",
    borderRadius: "5px",
  },
  VerifiedUserIconSx = {
    fontSize: "13px",
    position: "relative",
    top: "1.2px",
  },
  OverlayButtonSx = {
    color: "white",
    backgroundColor: "primary.500",
    fontSize: "16px",
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    marginRight: "2px",
  };

const UserMessage = React.memo((props) => {
  const [showPromptDialog, setShowPromptDialog] = useState(false),
    openConfirmPrompt = () => setShowPromptDialog(true),
    closeConfirmPrompt = () => setShowPromptDialog(false),
    name = LocalStorageManager.getName(),
    emotes = props.emotes.map((emote) => emote.name).join("|"),
    urlRegex = "https?://\\S+",
    regex = new RegExp(`(\\b${name}\\b|${emotes}|${urlRegex})`, "gi"),
    removeMessage = async () => {
      let resp = await ChatActionsManager.RemoveMessage(props.signalR, props.messageId);
      if (resp) closeConfirmPrompt();
    },
    max = 250,
    [isMiniminized, setMinimized] = useState(!props.isAdmin),
    content = props.content.length > max && isMiniminized ? props.content.substring(0, max) : props.content,
    openMinimized = () => setMinimized(false),
    getEmote = (emoteName) => props.emotes.find((emote) => emote.name === emoteName);

  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box className="wrapper-comment" sx={WrapperTextBoxSx}>
        {/* ------- Wrapper section ------- */}
        <Box className="wrapper-overlay" sx={OverlaySx}>
          <ManageUserDialog OverlayButtonSx={OverlayButtonSx} {...props} />
          {props.siteAdmin && (
            <>
              <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              {showPromptDialog && (
                <ConfirmDialog title="Remove message?" confirm={removeMessage} cancel={closeConfirmPrompt} />
              )}
            </>
          )}
        </Box>
        {/* ------- Username section ------- */}
        <Box display="inline-block">
          <Typography
            sx={TextSx(props.userColorDisplay, true)}
            className={`${props.enableChristmasTheme ? "santa-hat" : null} ${props.isAdmin ? "glow" : null}`}
          >
            {props.isAdmin && <VerifiedUserIcon sx={VerifiedUserIconSx} />}
            {props.sentBy}
          </Typography>
        </Box>
        {/* ------- Emote and username highlight section ------- */}
        <Typography component="span" sx={TextSx()}>
          {": "}
          {reactStringReplace(content, regex, (match, i) =>
            getEmote(match.toLowerCase()) ? (
              <img key={i} alt={match.toLowerCase()} className="emote" src={getEmote(match.toLowerCase()).url} />
            ) : match.match(urlRegex) ? (
              <Link key={i} href={match} target="_blank">
                {match}
              </Link>
            ) : (
              <Typography key={i} component="span" sx={HighlightSx}>
                {match}
              </Typography>
            )
          )}
          {isMiniminized && props.content.length > max && (
            <Link component="button" onClick={openMinimized}>
              {" [+]"}
            </Link>
          )}
        </Typography>
      </Box>
    </MessageWrapper>
  );
});

export default UserMessage;
