import { Box } from "@mui/material";
import React, { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@emotion/react";
import SitePlayer from "./player/SitePlayer";
import SiteDetails from "./layout/SiteDetails";
import SiteTop from "./layout/SiteTop";
import Chat from "./chat/Chat";
import ShowFireworks from "./others/ShowFireworks";
import ShowSnow from "./others/ShowSnow";
import ShowPing from "./others/ShowPing";
import LocalStorageManager from "../managers/LocalStorageManager";

const MainGridSx = {
    overflow: "hidden",
    height: "100%",
    direction: "row",
    alignItems: "stretch",
  },
  PlayerBoxSx = (theme) => ({
    overflowY: "auto",
    height: "calc(100% - 35px)",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      height: "calc(40% - 35px)",
      display: "block",
    },
  }),
  ChatBoxSx = (theme) => ({
    height: "calc(100% - 35px)",
    backgroundColor: "primary.900",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: "60%",
    },
    "&::after": {
      content: "''",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('/images/martahalloween.png')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "bottom right",
      backgroundSize: "160px",
      filter: "opacity(0.6)",
    },
  }),
  HalloweenAnimSx = {
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "0px",
      right: "0px",
      height: "160px",
      width: "160px",
      filter: "opacity(0.6)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100%",
      backgroundImage: 'url("../images/halloween-anim.gif")',
      pointerEvents: "none",
    },
  },
  PlayerContainerSx = {
    height: "100%",
    margin: "0 auto",
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "#121212",
  },
  SiteDetailsSx = {
    backgroundColor: "primary.900",
    display: "flex",
    flex: 1,
    alignItems: "center",
  };

const Layout = (props) => {
  const theme = useTheme(),
    multistreamStatus = LocalStorageManager.shouldShowSecondaryMultistream(),
    [useMultistreamSecondary, setMultistreamSecondary] = useState(multistreamStatus);

  return (
    <>
      <ShowFireworks {...props} />
      <ShowSnow {...props} />
      <ShowPing {...props} />
      <Grid container sx={MainGridSx}>
        <Grid xs={12}>
          <SiteTop {...props} />
        </Grid>
        <Grid xs={12} md={8} lg={9} xl={10} sx={PlayerBoxSx(theme)} className={"scrollbar-custom"}>
          <Box sx={PlayerContainerSx}>
            <SitePlayer {...props} useMultistreamSecondary={useMultistreamSecondary} />
          </Box>
          <Box sx={SiteDetailsSx}>
            <SiteDetails
              {...props}
              useMultistreamSecondary={useMultistreamSecondary}
              setMultistreamSecondary={setMultistreamSecondary}
            />
          </Box>
        </Grid>
        <Grid
          xs={12}
          md={4}
          lg={3}
          xl={2}
          sx={[ChatBoxSx(theme), props.configuration.enableHalloweenTheme && HalloweenAnimSx]}
        >
          <Chat {...props} />
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
