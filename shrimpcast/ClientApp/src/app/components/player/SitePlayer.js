import { Box, Typography } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import VideoJSPlayer from "./players/VideoJSPlayer";
import XGPlayer from "./players/XGPlayer";
import PickSource from "../layout/Actions/Sources/PickSource";
import Danmaku from "./players/Danmaku";
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
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const { streamStatus } = props,
    { source, streamEnabled, mustPickStream } = streamStatus,
    { useRTCEmbed, useLegacyPlayer } = source,
    url = source.url || "",
    video = useRef(),
    videoJsOptions = {
      vhs: {
        llhls: true,
        experimentalBufferBasedABR: true,
      },
      autoplay: "muted",
      controls: true,
      liveui: true,
      fill: true,
      playsinline: true,
      retryOnError: true,
      poster:
        "https://stream-eu.bfcdn.host/thumb/app/031304855496+miau/thumb.jpg",
      sources: [
        {
          src: url,
          type: "application/x-mpegURL",
        },
      ],
    },
    isHLS = url.endsWith(".m3u8"),
    forceM3U8 = isHLS && !window.MediaSource,
    [muted, setMuted] = useState(false),
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    };

  if (isHLS && forceM3U8) {
    videoJsOptions.sources[0].src =
      url.substr(0, url.lastIndexOf(".")) + ".m3u8";
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
        setMessages([]); // Clear messages on unmount
      };
    }
  }, [props.signalR]);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      setMessages([]);
      previousPath.current = location.pathname;
    }
  }, [location]);

  return streamEnabled ? (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {mustPickStream ? (
        <PickSource sources={streamStatus.sources} />
      ) : isHLS && !forceM3U8 ? (
        <>
          <XGPlayer url={url} />
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
          <VideoJSPlayer options={videoJsOptions} />
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
