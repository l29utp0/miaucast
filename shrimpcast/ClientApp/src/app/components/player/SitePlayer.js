import { Box, Typography } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import VideoJSPlayer from "./VideoJSPlayer";
import XPlayer from "./XPlayer";

const WrapperSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SitePlayer = (props) => {
  const {
      enableMultistreams,
      usePrimarySource,
      primaryStreamUrl,
      secondaryStreamUrl,
      streamEnabled,
      useRTCEmbed,
      useLegacyPlayer,
    } = props.configuration,
    url = enableMultistreams
      ? props.useMultistreamSecondary
        ? secondaryStreamUrl
        : primaryStreamUrl
      : usePrimarySource
        ? primaryStreamUrl
        : secondaryStreamUrl,
    [muted, setMuted] = useState(false),
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
    tryPlay = () => {
      let player = video.current.getInternalPlayer();
      if (player.play !== undefined) {
        player.play().catch(() => setMuted(true));
      } else {
        player.playVideo();
      }
    },
    isHLS = url.endsWith(".m3u8");

  return streamEnabled ? (
    isHLS ? (
      <XPlayer url={url} />
    ) : useRTCEmbed ? (
      <iframe
        src={`${url}?muted=false&autoplay=true`}
        title="rtc-embed"
        id="rtc-embed"
        allow="autoplay"
        allowFullScreen
      ></iframe>
    ) : !useLegacyPlayer ? (
      <VideoJSPlayer options={videoJsOptions} />
    ) : (
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
    )
  ) : (
    <Box sx={WrapperSx}>
      <Typography className="noselect" textAlign="center" variant="h2">
        Nada a tocar de momento ;_;
      </Typography>
    </Box>
  );
};

export default SitePlayer;
