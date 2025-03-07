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

const XGPlayer = (props) => {
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
        `<link rel="stylesheet" href="./lib/xg/index.min.css?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"/>`,
        {
          done: () => setLoadState((state) => ({ ...state, css: true })),
        },
      );
    if (!loadState.player)
      postscribe(
        "#player-xg",
        `<script src="./lib/xg/player.xg.js?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"></script>`,
        {
          done: () => setLoadState((state) => ({ ...state, player: true })),
        },
      );
    if (!loadState.hls)
      postscribe(
        "#player-xg-hls",
        `<script src="./lib/xg/xg.hls.js?cacheBurst=${process.env.REACT_APP_CACHE_BUST}"></script>`,
        {
          done: () => setLoadState((state) => ({ ...state, hls: true })),
        },
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loadState.css || !loadState.player || !loadState.hls) return;

    const noCacheUrl = () => `${props.url}?nocache=${new Date().getTime()}`,
      player = new window.Player({
      id: elId,
      url: noCacheUrl(),
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
      startTime: 4000,
      lang: "en",
      playbackRate: false,
      cssFullscreen: false,
      pip: true,
      poster: {
        poster: "/images/poster.avif",
        hideCanplay: true,
      },
      screenShot: {
        disable: false,
        width: 1920,
        height: 1080,
        quality: 1,
        name: "kino",
      },
    }),
      restartPlayback = (player) => {
        console.log("Attempting to restart playback.");
        player.switchURL(noCacheUrl());
      };

    player.on("error", () => restartPlayback(player));
    player.on("ended", () => restartPlayback(player));
    player.on("waiting", () => {
      clearTimeout(window.timeout);
      window.timeout = setTimeout(() => {
        try {
          if (player?.readyState <= 2) {
            restartPlayback(player);
          }
        } catch (e) {}
      }, 5000);
    });

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

export default XGPlayer;
