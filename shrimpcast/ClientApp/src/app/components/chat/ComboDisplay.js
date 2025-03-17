import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes, styled } from "@mui/material/styles";

// Define keyframe animations
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled components
const ComboWrapper = styled(Box)(({ theme, comboLevel, isShaking }) => ({
  position: "absolute",
  bottom: "60px",
  right: "10px",
  backgroundColor: theme.palette.primary[900],
  padding: "5px 10px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  zIndex: 5,
  opacity: 1,
  animation: isShaking ? `${shake} 0.5s ease-in-out` : "none",
  border: `2px solid ${COMBO_COLORS[comboLevel]}`,
  boxShadow: `0 0 10px ${COMBO_COLORS[comboLevel]}`,
  transition: "all 0.3s ease",
  cursor: "pointer",
}));

const ComboEmote = styled("img")(({ isShaking, comboLevel }) => ({
  height: "30px",
  animation: comboLevel === "unique" ? `${spin} 2s linear infinite` : "none",
  transition: "transform 0.3s",
  transform: isShaking ? "scale(1.1)" : "scale(1)",
}));

const ComboCount = styled(Typography)(({ theme, comboLevel, isShaking }) => ({
  color: COMBO_COLORS[comboLevel],
  fontSize: "24px",
  fontWeight: "bold",
  textShadow: "2px 2px 2px rgba(0,0,0,0.5)",
  transition: "color 0.3s, transform 0.3s",
  transform: isShaking ? "scale(1.1)" : "scale(1)",
}));

// Constants
const COMBO_COLORS = {
  common: "#BBCDCD",
  uncommon: "#37D179",
  rare: "#F47757",
  epic: "#478AE9",
  legendary: "#923EE1",
  mythic: "#FD6AE1",
  unique: "#FFD500",
};

const COMBO_THRESHOLDS = [
  { level: "unique", threshold: 18 },
  { level: "mythic", threshold: 15 },
  { level: "legendary", threshold: 12 },
  { level: "epic", threshold: 9 },
  { level: "rare", threshold: 6 },
  { level: "uncommon", threshold: 3 },
  { level: "common", threshold: 0 },
];

const ComboDisplay = ({ combo, emotes, setMessage }) => {
  const [isShaking, setIsShaking] = useState(false);
  const prevCountRef = useRef(combo.count);
  const isFirstRender = useRef(true);

  const getComboLevel = (count) => {
    return (
      COMBO_THRESHOLDS.find(({ threshold }) => count >= threshold)?.level ||
      "common"
    );
  };

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

  const comboLevel = getComboLevel(combo.count);

  return (
    <ComboWrapper
      onClick={handleClick}
      comboLevel={comboLevel}
      isShaking={isShaking}
      className={combo.count % 5 === 0 ? "combo-milestone" : ""}
    >
      <ComboEmote
        src={emote.url}
        alt={emote.name}
        isShaking={isShaking}
        comboLevel={comboLevel}
      />
      <ComboCount comboLevel={comboLevel} isShaking={isShaking}>
        x{combo.count}
      </ComboCount>
    </ComboWrapper>
  );
};

export default React.memo(ComboDisplay);
