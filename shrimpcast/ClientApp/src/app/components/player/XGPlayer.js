import { useState, useEffect, useRef } from "react";
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

const XGPlayer = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef(null);
  const containerId = "player_id";

  useEffect(() => {
    let ovenPlayer = null;

    const loadOvenPlayer = () => {
      if (playerRef.current) {
        playerRef.current.remove();
      }

      try {
        ovenPlayer = OvenPlayer.create(containerId, {
          sources: [
            {
              type: "ll-hls",
              file: props.url,
            },
          ],
          image: "/images/poster.avif",
          muted: true,
          autoStart: true,
          showSeekControl: true,
          hlsConfig: {
            loader: Hls.DefaultConfig.loader,
          },
        });

        // Store the player instance in the ref
        playerRef.current = ovenPlayer;

        // Handle player loading
        ovenPlayer.on("ready", () => {
          setIsLoading(false);
        });

        // Handle errors and reload
        ovenPlayer.on("error", (error) => {
          console.log("Player error, attempting to reload...", error);
          setTimeout(() => {
            loadOvenPlayer();
          }, 10000);
        });

        // Optional: Handle other events
        ovenPlayer.on("stateChanged", (state) => {
          console.log("Player state changed:", state);
        });
      } catch (error) {
        console.error("Error initializing OvenPlayer:", error);
        setIsLoading(false);
      }
    };

    // Load the player when component mounts
    loadOvenPlayer();

    // Cleanup function
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
  }, [props.url]); // Reload player when URL changes

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
