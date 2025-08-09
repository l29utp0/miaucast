import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Box, CircularProgress } from "@mui/material";
import OvenPlayer from "ovenplayer";
import Hls from "hls.js";

window.Hls = Hls;

const Loader = {
  width: "50px",
  top: "50%",
  left: "50%",
  position: "relative",
  transform: "translate(-50%, -50%)",
  webkitTransform: "translate(-50%, -50%);",
};

const XGPlayer = ({ url, onStateChange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);
  const lastErrorTime = useRef(0);
  const containerId = "player_id";

  // Add cache-busting to the URL
  const cacheBustedUrl = useMemo(() => {
    if (!url) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}_t=${Date.now()}`;
  }, [url]);

  // Stable callback refs to avoid dependency issues
  const handleReady = useCallback(() => {
    setIsLoading(false);
    console.log("XGPlayer ready");
  }, []);

  const handleError = useCallback((error) => {
    const currentTime = Date.now();
    const timeSinceLastError = currentTime - lastErrorTime.current;

    if (timeSinceLastError >= 10000) {
      console.log("Player error:", error);
      onStateChange?.("error");
      lastErrorTime.current = currentTime;
    }
  }, [onStateChange]);

  const handleStateChanged = useCallback((state) => {
    console.log("Player state changed:", state);
    onStateChange?.(state);
  }, [onStateChange]);

  const handlePlaying = useCallback(() => {
    onStateChange?.("playing");
  }, [onStateChange]);

  // Initialize player only once
  useEffect(() => {
    if (playerRef.current) return; // Don't recreate if player already exists

    try {
      const ovenPlayer = OvenPlayer.create(containerId, {
        sources: [
          {
            type: "ll-hls",
            file: cacheBustedUrl,
          },
        ],
        image: "/images/poster.avif",
        muted: true,
        autoStart: true,
        hlsConfig: {
          loader: Hls.DefaultConfig.loader,
        },
      });

      playerRef.current = ovenPlayer;

      ovenPlayer.on("ready", handleReady);
      ovenPlayer.on("error", handleError);
      ovenPlayer.on("stateChanged", handleStateChanged);
      ovenPlayer.on("playing", handlePlaying);

    } catch (error) {
      console.error("Error initializing OvenPlayer:", error);
      setIsLoading(false);
      onStateChange?.("error");
    }
  }, [cacheBustedUrl, handleReady, handleError, handleStateChanged, handlePlaying, onStateChange]);

  // Handle URL changes by updating the source
  useEffect(() => {
    if (!playerRef.current || !cacheBustedUrl) return;

    try {
      console.log("Updating player source to:", cacheBustedUrl);

      // Update the source without recreating the player
      playerRef.current.setCurrentSource(0, {
        type: "ll-hls",
        file: cacheBustedUrl,
      });

      setIsLoading(true);

    } catch (error) {
      console.error("Error updating player source:", error);
      onStateChange?.("error");
    }
  }, [cacheBustedUrl, onStateChange]);

  // Cleanup only when component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.remove();
        } catch (error) {
          console.error("Error removing player:", error);
        }
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {isLoading && (
        <Box sx={Loader}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}
      <div
        id={containerId}
        style={{
          width: "100%",
          height: "100%",
          display: isLoading ? "none" : "block",
          backgroundColor: "#000",
        }}
      />
    </div>
  );
};

export default XGPlayer;
