import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

const animations = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ComboDisplay = ({ combo, emotes, setMessage }) => {
  const [isShaking, setIsShaking] = useState(false);
  const prevCountRef = useRef(combo.count);
  const isFirstRender = useRef(true);

  const handleClick = () => {
    if (combo.emote) {
      setMessage((prevMessage) => prevMessage + combo.emote + " ");
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (combo.count > prevCountRef.current) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 250);
    }
    prevCountRef.current = combo.count;
  }, [combo.count]);

  if (!combo.emote || combo.count < 2) return null;

  const emote = emotes.find((e) => e.name === combo.emote);
  if (!emote) return null;

  const getComboLevel = (count) => {
    if (count >= 18) return "unique";
    if (count >= 15) return "mythic";
    if (count >= 12) return "legendary";
    if (count >= 9) return "epic";
    if (count >= 6) return "rare";
    if (count >= 3) return "uncommon";
    return "common";
  };

  const comboLevel = getComboLevel(combo.count);

  const comboColors = {
    common: "#BBCDCD",
    uncommon: "#37D179",
    rare: "#F47757",
    epic: "#478AE9",
    legendary: "#923EE1",
    mythic: "#FD6AE1",
    unique: "#FFD500",
  };

  return (
    <>
      <style>{animations}</style>
      <Box
        onClick={handleClick}
        sx={{
          position: "absolute",
          bottom: "60px",
          right: "10px",
          backgroundColor: "primary.900",
          padding: "5px 10px",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          zIndex: 5,
          opacity: 1,
          animation: isShaking ? "shake 0.5s ease-in-out" : undefined,
          border: `2px solid ${comboColors[comboLevel]}`,
          boxShadow: `0 0 10px ${comboColors[comboLevel]}`,
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        className={combo.count % 5 === 0 ? "combo-milestone" : ""}
      >
        <img
          src={emote.url}
          alt={emote.name}
          style={{
            height: "40px",
            animation:
              comboLevel === "unique" ? "spin 2s linear infinite" : "none",
            transition: "transform 0.3s",
            transform: isShaking ? "scale(1.1)" : "scale(1)",
          }}
        />
        <Typography
          sx={{
            color: comboColors[comboLevel],
            fontSize: "24px",
            fontWeight: "bold",
            textShadow: "2px 2px 2px rgba(0,0,0,0.5)",
            transition: "color 0.3s, transform 0.3s",
            transform: isShaking ? "scale(1.1)" : "scale(1)",
          }}
        >
          x{combo.count}
        </Typography>
      </Box>
    </>
  );
};

export default ComboDisplay;
