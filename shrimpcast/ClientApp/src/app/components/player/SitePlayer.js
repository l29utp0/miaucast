import { Box, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import XGPlayer from "./XGPlayer";
import PickSource from "../layout/Actions/Sources/PickSource";
import Danmaku from "./Danmaku";
import { useLocation } from "react-router-dom";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const [messages, setMessages] = useState([]);
  const [activeStreams, setActiveStreams] = useState(new Set());
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const { streamStatus } = props;
  const { source, streamEnabled, mustPickStream } = streamStatus;
  const { useRTCEmbed, useLegacyPlayer } = source;
  let url = source.url || "";
  const video = useRef();
  const isHLS = url.endsWith(".m3u8");
  const forceM3U8 = isHLS && !window.MediaSource;
  const [muted, setMuted] = useState(false);

  const tryPlay = () => {
    let player = video.current.getInternalPlayer();
    if (player.play !== undefined) {
      player.play().catch(() => setMuted(true));
    } else {
      player.playVideo();
    }
  };

  // Function to check stream state
  const checkStreamState = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Effect to periodically check stream states
  useEffect(() => {
    if (!mustPickStream || !streamStatus.sources) return;

    const checkStreams = async () => {
      const newActiveStreams = new Set();

      for (const source of streamStatus.sources) {
        if (source.url && streamEnabled) {
          const isActive = await checkStreamState(source.url);
          if (isActive) {
            newActiveStreams.add(source.name);
          }
        }
      }

      setActiveStreams(newActiveStreams);
    };

    // Initial check
    checkStreams();

    // Set up periodic checking
    const interval = setInterval(checkStreams, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [mustPickStream, streamStatus.sources, streamEnabled]);

  if (isHLS && forceM3U8) {
    url = url.substr(0, url.lastIndexOf(".")) + ".m3u8";
    console.log("Forcing M3U8 because FLV is not supported.");
  }

  useEffect(() => {
    if (props.signalR) {
      props.signalR.on("ChatMessage", (message) => {
        if (message.messageType === "UserMessage" && message.messageId) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return () => {
        props.signalR.off("ChatMessage");
        setMessages([]);
      };
    }
  }, [props.signalR]);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setMessages([]);
      previousPath.current = location.pathname;
    }
  }, [location]);

  // Handle XGPlayer events
  const handlePlayerStateChange = (state) => {
    if (!mustPickStream && source?.name) {
      if (state === "playing") {
        setActiveStreams((prev) => new Set(prev).add(source.name));
      } else if (state === "error") {
        setActiveStreams((prev) => {
          const newSet = new Set(prev);
          newSet.delete(source.name);
          return newSet;
        });
      }
    }
  };

  return streamEnabled ? (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {mustPickStream ? (
        <PickSource
          sources={streamStatus.sources.map((source) => ({
            ...source,
            isStreaming:
              !source.url.endsWith(".m3u8") || activeStreams.has(source.name),
          }))}
        />
      ) : isHLS && !forceM3U8 ? (
        <>
          <XGPlayer url={url} onStateChange={handlePlayerStateChange} />
          <Danmaku messages={messages} emotes={props.emotes} isActive={true} />
        </>
      ) : useRTCEmbed ? (
        <>
          <iframe
            src={`${url}`}
            title="rtc-embed"
            id="rtc-embed"
            allow="autoplay"
            allowFullScreen
          />
          <Danmaku messages={messages} emotes={props.emotes} isActive={true} />
        </>
      ) : !useLegacyPlayer ? (
        <>
          <XGPlayer url={url} onStateChange={handlePlayerStateChange} />
          <Danmaku messages={messages} emotes={props.emotes} isActive={true} />
        </>
      ) : (
        <>
          <ReactPlayer
            width={"100%"}
            height={"100%"}
            controls
            playsinline
            url={url}
            ref={video}
            playing={muted}
            muted={muted}
            onReady={tryPlay}
            onPlay={() => handlePlayerStateChange("playing")}
            onError={() => handlePlayerStateChange("error")}
          />
          <Danmaku messages={messages} emotes={props.emotes} isActive={true} />
        </>
      )}
    </div>
  ) : (
    <Box sx={WrapperSx}>
      <Typography className="noselect" textAlign="center" variant="h2">
        Nada a tocar de momento ;_;
      </Typography>
    </Box>
  );
};

export default SitePlayer;
