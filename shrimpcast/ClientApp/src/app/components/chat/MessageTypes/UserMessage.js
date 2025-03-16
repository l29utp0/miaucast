import { Box, IconButton, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import reactStringReplace from "react-string-replace";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import ManageUserDialog from "../ManageUserDialog";
import ConfirmDialog from "../../others/ConfirmDialog";
import MessageWrapper from "./MessageWrapper";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const WrapperTextBoxSx = {
    margin: "5px",
    wordWrap: "break-word",
    padding: "2px",
    position: "relative",
    zIndex: 1,
    "&:hover": {
      backgroundColor: "primary.800",
    },
  },
  TextSx = (color, force, gt) => ({
    fontWeight: color || force ? "bold" : "none",
    color: color ? color : gt ? "#789922" : "white",
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
    backgroundColor: "primary.800",
    fontSize: "16px",
    width: "20px",
    height: "20px",
    borderRadius: "5px",
    marginRight: "2px",
  };

// Define a new style for internal links
const InternalLinkSx = {
  fontWeight: "bold",
  color: "secondary.main",
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
};

const InternalLinkIconSx = {
  fontSize: "10px",
  color: "secondary.main",
};

const UserMessage = React.memo((props) => {
  const navigate = useNavigate();
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const openConfirmPrompt = () => setShowPromptDialog(true);
  const closeConfirmPrompt = () => setShowPromptDialog(false);
  const { isAdmin, isMod, isGolden, maxLengthTruncation } = props;

  // Function to determine if a URL is from your own domain
  const isOwnDomainUrl = (url) => {
    try {
      const urlObj = new URL(url);
      // Check if it's your domain - adjust to match your actual domain
      return (
        urlObj.hostname === "miau.gg" ||
        urlObj.hostname === window.location.hostname
      );
    } catch (e) {
      return false;
    }
  };

  // Function to extract the path from a URL
  const getPathFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (e) {
      return url;
    }
  };

  // Function to extract the path from a URL and remove the leading slash
  const formatInternalLink = (url) => {
    try {
      const urlObj = new URL(url);
      // Remove the leading slash from the path
      return urlObj.pathname.replace(/^\//, "");
    } catch (e) {
      // For invalid URLs or if there's an error, return just the string without leading slash
      return url.replace(/^\//, "");
    }
  };

  // Handle click on internal links
  const handleInternalLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
  };

  const escapedName = LocalStorageManager.getName().replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  // Use lookahead assertion to ensure we're matching the full name
  const nameRegex = `@${escapedName}(?:\\s|$|\\.)`;
  const emotes = props.emotes.map((emote) => emote.name).join("|");
  const urlRegex = "https?://\\S+";
  const slashCommandRegex = "\\/[a-zA-Z0-9_-]+";
  const regex = new RegExp(
    `(${nameRegex}|${emotes}|${urlRegex}|${slashCommandRegex})`,
    "giu",
  );

  const removeMessage = async () => {
    let resp = await ChatActionsManager.RemoveMessage(
      props.signalR,
      props.messageId,
    );
    if (resp) closeConfirmPrompt();
  };

  const [isMiniminized, setMinimized] = useState(!isAdmin);
  const openMinimized = () => setMinimized(false);
  const content =
    props.content.length > maxLengthTruncation && isMiniminized
      ? props.content.substring(0, maxLengthTruncation)
      : props.content;
  const getEmote = (emoteName) =>
    props.emotes.find((emote) => emote.name === emoteName);

  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box className="wrapper-comment" sx={WrapperTextBoxSx}>
        <Box className="wrapper-overlay" sx={OverlaySx}>
          <ManageUserDialog OverlayButtonSx={OverlayButtonSx} {...props} />
          {props.siteAdmin && (
            <>
              <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                <DeleteIcon sx={{ fontSize: "16px" }} />
              </IconButton>
              {showPromptDialog && (
                <ConfirmDialog
                  title="Apagar mensagem?"
                  confirm={removeMessage}
                  cancel={closeConfirmPrompt}
                />
              )}
            </>
          )}
        </Box>
        <Box display="inline-block">
          <Typography
            sx={TextSx(props.userColorDisplay, true)}
            className={`${
              props.enableChristmasTheme
                ? "santa-hat"
                : props.enableHalloweenTheme
                  ? "halloween-hat"
                  : null
            } ${isAdmin ? "admin-glow" : isMod ? "mod-glow" : isGolden ? "golden-glow" : null}`}
          >
            {isAdmin && <VerifiedUserIcon sx={VerifiedUserIconSx} />}
            {isMod && <VerifiedUserIcon sx={VerifiedUserIconSx} />}
            {isGolden && <WorkspacePremiumIcon sx={VerifiedUserIconSx} />}
            {props.sentBy}
          </Typography>
        </Box>
        {": "}
        <Typography
          component="span"
          sx={TextSx(null, false, content.startsWith(">"))}
        >
          {reactStringReplace(content, regex, (match, i) => {
            if (getEmote(match.toLowerCase())) {
              return (
                <img
                  key={i}
                  alt={match.toLowerCase()}
                  className="emote"
                  src={getEmote(match.toLowerCase()).url}
                />
              );
            } else if (match.match(urlRegex)) {
              // Handle URLs first
              return isOwnDomainUrl(match) ? (
                <RouterLink
                  key={i}
                  to={getPathFromUrl(match)}
                  onClick={(e) =>
                    handleInternalLinkClick(e, getPathFromUrl(match))
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Box component="span" sx={InternalLinkSx}>
                    <PlayArrowIcon sx={InternalLinkIconSx} />
                    {formatInternalLink(match)}
                  </Box>
                </RouterLink>
              ) : (
                <Link key={i} href={match} target="_blank">
                  {match}
                </Link>
              );
            } else if (match.match(/^\/[a-zA-Z0-9_-]+$/)) {
              // Only handle exact slash commands
              const path = match.substring(1); // Remove the leading slash
              return (
                <RouterLink
                  key={i}
                  to={`/${path}`}
                  onClick={(e) => handleInternalLinkClick(e, `/${path}`)}
                  style={{ textDecoration: "none" }}
                >
                  <Box component="span" sx={InternalLinkSx}>
                    <PlayArrowIcon sx={InternalLinkIconSx} />
                    {path}
                  </Box>
                </RouterLink>
              );
            } else {
              return (
                <Typography key={i} component="span" sx={HighlightSx}>
                  {match}
                </Typography>
              );
            }
          })}
          {isMiniminized && props.content.length > maxLengthTruncation && (
            <Link
              component="button"
              sx={{ color: "secondary.500", ml: "2.5px" }}
              title="Expandir"
              onClick={openMinimized}
            >
              {" [+]"}
            </Link>
          )}
        </Typography>
      </Box>
    </MessageWrapper>
  );
});

export default UserMessage;
