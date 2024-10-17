import { Box, Button, Slide } from "@mui/material";
import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import PollIcon from "@mui/icons-material/Poll";
import Poll from "../polls/Poll";

const PollButtonSx = {
    bgcolor: "primary.900",
    borderRadius: "0px",
    width: "100%",
    textAlign: "center",
    height: "35px",
    maxHeight: "35px",
    display: "flex",
    justifyContent: "center",
  },
  DrawerSx = (bottomHeight) => ({
    maxHeight: `min(calc(100% - 63px - ${bottomHeight}px), 225px)`,
    backgroundColor: "primary.900",
    position: "absolute",
    width: "100%",
    zIndex: 2,
    overflowY: "auto",
  });

const ActivePoll = (props) => {
  const [show, setShow] = useState(true),
    toggleStatus = () => setShow(!show),
    { isAdmin, isGolden, configuration, goldenPassExpanded } = props,
    { showPoll, showGoldenPassButton } = configuration;

  useEffect(() => {
    if (showPoll) setShow(true);
  }, [showPoll]);

  return (
    <Box hidden={!showPoll}>
      <Paper sx={PollButtonSx}>
        <Button
          sx={{ width: "100%", position: "relative", zIndex: 1 }}
          color="secondary"
          variant="outlined"
          endIcon={<PollIcon />}
          onClick={toggleStatus}
        >
          <Box marginTop="2.5px">{show ? "Esconder" : "Mostrar"} votação</Box>
        </Button>
      </Paper>
      <Slide direction="left" in={show}>
        <Box
          sx={DrawerSx(!isAdmin && !isGolden && showGoldenPassButton && goldenPassExpanded ? 56 + 20 : 56)}
          className="scrollbar-custom"
        >
          <Poll {...props} />
        </Box>
      </Slide>
    </Box>
  );
};

export default ActivePoll;
