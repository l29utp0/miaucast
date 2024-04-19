import { Box } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { useTheme } from "@emotion/react";
import SitePlayer from "./player/SitePlayer";
import SiteDetails from "./layout/SiteDetails";
import SiteTop from "./layout/SiteTop";
import Chat from "./chat/Chat";
import ShowFireworks from "./others/ShowFireworks";
import ShowSnow from "./others/ShowSnow";
import ShowPing from "./others/ShowPing";
import { HelmetProvider, Helmet } from "react-helmet-async";

const MainGridSx = {
    overflow: "hidden",
    height: "100%",
    direction: "row",
    alignItems: "stretch",
  },
  PlayerBoxSx = (theme) => ({
    overflowY: "scroll",
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
    [theme.breakpoints.down("md")]: {
      height: "60%",
    },
  }),
  PlayerContainerSx = (theme, fullHeight) => ({
    height: fullHeight ? "100%" : "90%",
    aspectRatio: 16 / 9,
    margin: "0 auto",
    width: "100%",
    borderRadius: "5px",
    backgroundColor: "#121212",
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  }),
  SiteDetailsSx = {
    backgroundColor: "primary.900",
    display: "flex",
    flex: 1,
    alignItems: "center",
  };

const Layout = (props) => {
  const theme = useTheme(),
    { streamTitle, streamDescription } = props.configuration;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{streamTitle}</title>
        </Helmet>
      </HelmetProvider>
      <ShowFireworks {...props} />
      <ShowSnow {...props} />
      <ShowPing {...props} />
      <Grid container sx={MainGridSx}>
        <Grid xs={12}>
          <SiteTop {...props} />
        </Grid>
        <Grid xs={12} md={8} lg={9} xl={10} sx={PlayerBoxSx(theme)}>
          <Box sx={PlayerContainerSx(theme, !streamTitle && !streamDescription)}>
            <SitePlayer {...props} />
          </Box>
          <Box sx={SiteDetailsSx}>
            <SiteDetails {...props} />
          </Box>
        </Grid>
        <Grid xs={12} md={4} lg={3} xl={2} sx={ChatBoxSx(theme)}>
          <Chat {...props} />
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
