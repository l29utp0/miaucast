import { useState, useEffect } from "react";
import postscribe from "postscribe";
import { Box, CircularProgress } from "@mui/material";

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const XPlayer = (props) => {
  const elId = "xg-player-cont",
    [loadState, setLoadState] = useState({
      css: false,
      hls: false,
      player: false,
    });

  useEffect(() => {
    if (!loadState.css)
      postscribe(
        "#player-xg-css",
        '<link rel="stylesheet" href="./lib/xg/index.min.css"/>',
        {
          done: () => setLoadState((state) => ({ ...state, css: true })),
        },
      );
    if (!loadState.player)
      postscribe(
        "#player-xg",
        '<script src="./lib/xg/player.xg.js"></script>',
        {
          done: () => setLoadState((state) => ({ ...state, player: true })),
        },
      );
    if (!loadState.hls)
      postscribe(
        "#player-xg-hls",
        '<script src="./lib/xg/xg.hls.js"></script>',
        {
          done: () => setLoadState((state) => ({ ...state, hls: true })),
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadState.css || !loadState.player || !loadState.hls) return;
    let player = new window.Player({
      id: elId,
      url: props.url,
      playsinline: true,
      autoplay: true,
      autoplayMuted: true,
      isLive: true,
      height: undefined,
      width: undefined,
      rotate: true,
      plugins: [window.HlsPlayer],
      hls: {
        targetLatency: 7,
        maxLatency: 14,
      },
      lang: "en",
      playbackRate: false,
      cssFullscreen: false,
      pip: true,
      poster: {
        poster: "/images/poster.png",
        hideCanplay: true,
      },
      screenShot: {
        disable: false,
        width: 1920,
        height: 1080,
        quality: 1,
        name: "kino",
      },
    });

    // Monitor errors, waiting, and stream end
    player.on("error", (err) => {
      console.error("Playback error occurred:", err);
      if (player.readyState <= 2) {
        console.warn("Retrying playback...");
        player.replay();
      }
    });

    player.on("waiting", () => {
      console.warn("Buffering... monitoring the situation.");
      if (!window.bufferingTimeout) {
        window.bufferingTimeout = setTimeout(() => {
          if (player?.readyState <= 2) {
            console.warn("Playback stuck. Attempting to restart...");
            player.replay();
          }
        }, 5000);
      }
    });

    player.on("ended", () => {
      console.info("The live stream appears to have ended.");
    });

    if (window.bufferingTimeout) {
      clearTimeout(window.bufferingTimeout);
      delete window.bufferingTimeout;
    }

    return () => player.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, props.url]);

  return (
    <div className="full-height">
      {(!loadState.css || !loadState.player || !loadState.hls) && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      <div id="player-xg-css" />
      <div id="player-xg" />
      <div id="player-xg-hls" />
      <div id={elId} />
    </div>
  );
};

export default XPlayer;
