import { Box, IconButton, Link, Typography } from "@mui/material";
import React, { useCallback } from "react";
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
import { Tooltip } from "@mui/material";

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
  NameSx = (color) => ({
    fontWeight: "bold",
    color: color || "white",
    display: "inline",
    fontSize: "15px",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
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
  InternalLinkSx = {
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

const UserMessage = React.memo(
  (props) => {
    const navigate = useNavigate();
    const [showPromptDialog, setShowPromptDialog] = React.useState(false);
    const openConfirmPrompt = () => setShowPromptDialog(true);
    const closeConfirmPrompt = () => setShowPromptDialog(false);
    const { isAdmin, isMod, isGolden, maxLengthTruncation, userColorDisplay } =
      props;
    const { onNameClick, sentBy } = props;

    const handleNameClick = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onNameClick) {
          onNameClick(sentBy);
        }
      },
      [onNameClick, sentBy],
    );

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
    const nameRegex = `@${escapedName}(?:\\s|$|\\.)`;
    const emotes = props.emotes.map((emote) => emote.name).join("|");
    const urlRegex = "https?://\\S+";
    const slashCommandRegex = "(?:^|\\s)\\/[a-zA-Z0-9_-]+(?:\\s|$)";
    const regex = new RegExp(
      `(${nameRegex}|${emotes}|${urlRegex}|${slashCommandRegex})`,
      "giu",
    );

    const removeMessage = useCallback(async () => {
      let resp = await ChatActionsManager.RemoveMessage(
        props.signalR,
        props.messageId,
      );
      if (resp) closeConfirmPrompt();
    }, [props.signalR, props.messageId]);

    const [isMiniminized, setMinimized] = React.useState(!isAdmin);
    const openMinimized = () => setMinimized(false);
    const content =
      props.content.length > maxLengthTruncation && isMiniminized
        ? props.content.substring(0, maxLengthTruncation)
        : props.content;
    const getEmote = useCallback(
      (emoteName) => props.emotes.find((emote) => emote.name === emoteName),
      [props.emotes],
    );

    return (
      <MessageWrapper useTransition={props.useTransition}>
        <Box
          className={`wrapper-comment ${props.isComboMessage ? "combo-message" : ""}`}
          sx={WrapperTextBoxSx}
        >
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
              onClick={handleNameClick}
              sx={NameSx(userColorDisplay)}
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
                  <Link key={i} href={match} target="_blank">
                    {match}
                  </Link>
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
  },
  (prevProps, nextProps) => {
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
  },
);

export default UserMessage;
