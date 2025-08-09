import { Box, IconButton, Typography, Link as DefaultLink, Tooltip } from "@mui/material";
import React, { useState, useCallback } from "react";
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
import ReplyIcon from "@mui/icons-material/Reply";

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
  },
  ExpandButtonSx = {
    color: "secondary.500",
    ml: "2.5px",
    fontWeight: "bold",
  },
  HoverUnderlineSx = {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  InternalLinkSx = {
    fontWeight: "bold",
    color: "secondary.main",
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  SourceLinkSx = {
    ml: "2.5px",
    mr: "2.5px",
    fontWeight: "bold",
    fontSize: "15px",
    color: "secondary.main",
    display: "inline-flex",
    alignItems: "center",
    textDecoration: "none",
    ...HoverUnderlineSx,
  };

const InternalLinkIconSx = {
  fontSize: "10px",
  color: "secondary.main",
};

const UserMessage = React.memo((props) => {
  const navigate = useNavigate();
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [externalOpenUserDialog, setExternalOpenUserDialog] = useState(false);

  const openConfirmPrompt = () => setShowPromptDialog(true);
  const closeConfirmPrompt = () => setShowPromptDialog(false);
  const openExternalUserDialog = () => setExternalOpenUserDialog(true);
  const closeExternalUserDialog = () => setExternalOpenUserDialog(false);

  const {
    isAdmin,
    isMod,
    isGolden,
    maxLengthTruncation,
    userColorDisplay,
    sources,
    emotesRegex,
    emotes,
    enabledSources
  } = props;

  const isOwnDomainUrl = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname === "miau.gg" ||
        urlObj.hostname === window.location.hostname
      );
    } catch (e) {
      return false;
    }
  }, []);

  const getPathFromUrl = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch (e) {
      return url;
    }
  }, []);

  const formatInternalLink = useCallback((url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, "");
    } catch (e) {
      return url.replace(/^\//, "");
    }
  }, []);

  const handleInternalLinkClick = useCallback(
    (e, path) => {
      e.preventDefault();
      navigate(path);
    },
    [navigate],
  );

  const escapedName = LocalStorageManager.getName().replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const nameRegex = `@${escapedName}(?=[\\s.]|$)`;
  const sourcesRegex = sources ? `(?:^|\\s)(?:${sources})(?=\\s|$)` : "";
  const urlRegex = "https?://\\S+";
  const slashCommandRegex = "(?:^|\\s)\\/[a-zA-Z0-9_-]+(?:\\s|$)";

  const regex = new RegExp(
    `(${nameRegex}|${urlRegex}${emotesRegex ? "|" + emotesRegex : ""}${sourcesRegex ? "|" + sourcesRegex : ""}${slashCommandRegex ? "|" + slashCommandRegex : ""})`,
    "giu",
  );

  const removeMessage = useCallback(async () => {
    const response = await ChatActionsManager.RemoveMessage(props.signalR, props.messageId);
    if (response) closeConfirmPrompt();
  }, [props.signalR, props.messageId]);

  const [isMiniminized, setMinimized] = useState(!isAdmin);
  const openMinimized = () => setMinimized(false);

  const content =
    props.content.length > maxLengthTruncation && isMiniminized
      ? props.content.substring(0, maxLengthTruncation)
      : props.content;

  const getEmote = useCallback(
    (emoteName) => emotes.find((emote) => emote.name === emoteName),
    [emotes],
  );

  const getSource = useCallback(
    (sourceName) => enabledSources?.find((eS) => `/${eS.name.toLowerCase()}` === sourceName),
    [enabledSources],
  );

  const replyToUser = () => {
    const event = new CustomEvent("userReply", {
      detail: { content: ` @${props.sentBy} ` },
    });
    document.dispatchEvent(event);
  };

  return (
    <MessageWrapper useTransition={props.useTransition}>
      <Box
        className={`wrapper-comment ${props.isComboMessage ? "combo-message" : ""}`}
        sx={WrapperTextBoxSx}
      >
        <Box className="wrapper-overlay" sx={OverlaySx}>
          <Tooltip title="Responder">
            <IconButton sx={OverlayButtonSx} onClick={replyToUser}>
              <ReplyIcon sx={{ fontSize: "16px" }} />
            </IconButton>
          </Tooltip>
          <ManageUserDialog
            OverlayButtonSx={OverlayButtonSx}
            externalOpenUserDialog={externalOpenUserDialog}
            closeExternalUserDialog={closeExternalUserDialog}
            skipUserDialogButton={true}
            {...props}
          />
          {props.siteAdmin && (
            <>
              <Tooltip title="Apagar">
                <IconButton sx={OverlayButtonSx} onClick={openConfirmPrompt}>
                  <DeleteIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Tooltip>
              {showPromptDialog && (
                <ConfirmDialog
                  title="Apagar?"
                  confirm={removeMessage}
                  cancel={closeConfirmPrompt}
                />
              )}
            </>
          )}
        </Box>
        <Box display="inline-block">
          <Typography
            onClick={openExternalUserDialog}
            sx={[
              TextSx(userColorDisplay, true),
              HoverUnderlineSx,
              //isGolden ? GoldenPassGlow(userColorDisplay) : null
            ]}
            className={`${
              props.enableChristmasTheme
                ? "santa-hat"
                : props.enableHalloweenTheme
                  ? "halloween-hat"
                  : null
            } ${isAdmin ? "admin-glow" : isMod ? "mod-glow" : null}`}
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
            // First check for emotes
            const emote = getEmote(match.toLowerCase());
            if (emote) {
              return (
                <Tooltip key={i} title={emote.name} placement="top" arrow>
                  <img
                    alt={match.toLowerCase()}
                    className={`emote ${props.isComboMessage ? "combo-emote" : ""}`}
                    src={emote.url}
                  />
                </Tooltip>
              );
            }

            // Then check for URLs
            if (match.match(/^https?:\/\//i)) {
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
                <DefaultLink key={i} href={match} target="_blank">
                  {match}
                </DefaultLink>
              );
            }

            // Check for source links
            const source = getSource(match.trim().toLowerCase());
            if (source) {
              return (
                <RouterLink key={i} to={match.trim().toLowerCase()} style={{ textDecoration: "none" }}>
                  <Typography sx={SourceLinkSx}>
                    <PlayArrowIcon sx={{ fontSize: "10px", color: "secondary.main" }} />
                    {match.trim().toLowerCase()}
                  </Typography>
                </RouterLink>
              );
            }

            // Check for slash commands
            if (match.trim().match(/^\/[a-zA-Z0-9_-]+$/)) {
              const path = match.trim().substring(1);
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
            }

            // Handle mentions and other matches
            return (
              <Typography key={i} component="span" sx={HighlightSx}>
                {match}
              </Typography>
            );
          })}
          {isMiniminized && props.content.length > maxLengthTruncation && (
            <DefaultLink
              component="button"
              sx={ExpandButtonSx}
              title="Click to expand"
              onClick={openMinimized}
            >
              {" [+]"}
            </DefaultLink>
          )}
        </Typography>
      </Box>
    </MessageWrapper>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.content === nextProps.content &&
    prevProps.sentBy === nextProps.sentBy &&
    prevProps.isComboMessage === nextProps.isComboMessage &&
    prevProps.userColorDisplay === nextProps.userColorDisplay &&
    prevProps.isAdmin === nextProps.isAdmin &&
    prevProps.isMod === nextProps.isMod &&
    prevProps.isGolden === nextProps.isGolden
  );
});

export default UserMessage;
