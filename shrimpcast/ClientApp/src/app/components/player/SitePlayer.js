import { Box, Typography } from "@mui/material";
import React, { useRef, useState, useEffect, memo, useCallback } from "react";
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

// Memoized Player Component
const Player = memo(
  ({ url, onStateChange, useRTCEmbed, useLegacyPlayer }) => {
    const video = useRef();
    const [muted, setMuted] = useState(false);
    const isHLS = url.endsWith(".m3u8");
    const forceM3U8 = isHLS && !window.MediaSource;

    const adjustedUrl =
      isHLS && forceM3U8 ? url.substr(0, url.lastIndexOf(".")) + ".m3u8" : url;

    const tryPlay = () => {
      let player = video.current?.getInternalPlayer();
      if (player?.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else if (player?.playVideo) {
        player.playVideo();
      }
    };

    if (isHLS && !forceM3U8) {
      return <XGPlayer url={adjustedUrl} onStateChange={onStateChange} />;
    } else if (useRTCEmbed) {
      return (
        <iframe
          src={`${adjustedUrl}`}
          title="rtc-embed"
          id="rtc-embed"
          allow="autoplay"
          allowFullScreen
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      );
    } else if (!useLegacyPlayer) {
      return <XGPlayer url={adjustedUrl} onStateChange={onStateChange} />;
    } else {
      return (
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          controls
          playsinline
          url={adjustedUrl}
          ref={video}
          playing={muted}
          muted={muted}
          onReady={tryPlay}
          onPlay={() => onStateChange("playing")}
          onError={() => onStateChange("error")}
        />
      );
    }
  },
  (prevProps, nextProps) => {
    return (
      prevProps.url === nextProps.url &&
      prevProps.useRTCEmbed === nextProps.useRTCEmbed &&
      prevProps.useLegacyPlayer === nextProps.useLegacyPlayer
    );
  },
);

// Memoized Danmaku component wrapper
const MemoizedDanmaku = memo(({ messages, emotes, isActive }) => {
  return <Danmaku messages={messages} emotes={emotes} isActive={isActive} />;
});

const SitePlayer = (props) => {
  const [messages, setMessages] = useState([]);
  const [activeStreams, setActiveStreams] = useState(new Set());
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  const { streamStatus } = props;
  const { source, streamEnabled, mustPickStream } = streamStatus;
  const { useRTCEmbed, useLegacyPlayer } = source;
  const url = source.url || "";

  const checkStreamState = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handlePlayerStateChange = useCallback(
    (state) => {
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
    },
    [mustPickStream, source?.name],
  );

  // Effect to handle chat messages
  useEffect(() => {
    if (!props.signalR) return;

    const handleChatMessage = (message) => {
      if (message.messageType === "UserMessage" && message.messageId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    props.signalR.on("ChatMessage", handleChatMessage);

    return () => {
      props.signalR.off("ChatMessage");
      setMessages([]);
    };
  }, [props.signalR]);

  // Effect to handle path changes
  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setMessages([]);
      previousPath.current = location.pathname;
    }
  }, [location]);

  // Effect to periodically check stream states
  useEffect(() => {
    if (!mustPickStream || !streamStatus.sources) return;

    const checkStreams = async () => {
      const newActiveStreams = new Set();

      for (const source of streamStatus.sources) {
        // Only check m3u8 streams
        if (source.url?.endsWith(".m3u8") && streamEnabled) {
          const isActive = await checkStreamState(source.url);
          if (isActive) {
            newActiveStreams.add(source.name);
          }
        } else if (!source.url?.endsWith(".m3u8")) {
          // Automatically mark non-m3u8 streams as active
          newActiveStreams.add(source.name);
        }
      }

      setActiveStreams(newActiveStreams);
    };

    checkStreams();
    const interval = setInterval(checkStreams, 30000);
    return () => clearInterval(interval);
  }, [mustPickStream, streamStatus.sources, streamEnabled]);

  if (!streamEnabled) {
    return (
      <Box sx={WrapperSx}>
        <Typography className="noselect" textAlign="center" variant="h2">
          Nada a tocar de momento ;_;
        </Typography>
      </Box>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {mustPickStream ? (
        <PickSource
          sources={streamStatus.sources.map((source) => ({
            ...source,
            isStreaming:
              !source.url?.endsWith(".m3u8") || activeStreams.has(source.name),
          }))}
        />
      ) : (
        <>
          <Player
            key={url}
            url={url}
            onStateChange={handlePlayerStateChange}
            useRTCEmbed={useRTCEmbed}
            useLegacyPlayer={useLegacyPlayer}
          />
          <MemoizedDanmaku
            messages={messages}
            emotes={props.emotes}
            isActive={true}
          />
        </>
      )}
    </div>
  );
};

export default SitePlayer;
