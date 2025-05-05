import {
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import ConfigUserDialog from "./ConfigUserDialog";
import Bans from "./Bans";
import ActiveUsers from "./ActiveUsers";
import AutoModFilters from "./AutoModFilters";
import Notifications from "./Notifications";
import AccountInfo from "./AccountInfo";
import EmotesAdmin from "./EmotesAdmin";
import MenuIcon from "@mui/icons-material/Menu";
import Mutes from "./Mutes";
import Moderators from "./Moderators";
import IgnoredUsers from "./IgnoredUsers";
import BingoOptions from "./BingoOptions";
import GoldenPassInfo from "./GoldenPassInfo";
import About from "./About";

const Actions = (props) => {
  const theme = useTheme();
  const shouldCollapseMenu = useMediaQuery(theme.breakpoints.down("md"));

  // Determine which actions to show based on user role
  const getActionsComponents = () => {
    const { isAdmin, isGolden, isMod } = props;

    if (isAdmin) {
      return [
        <ConfigUserDialog {...props} />,
        <ActiveUsers {...props} />,
        <Bans {...props} />,
        <Mutes {...props} />,
        <AutoModFilters {...props} />,
        <Moderators {...props} />,
        <Notifications {...props} />,
        <EmotesAdmin {...props} />,
        <BingoOptions {...props} />,
        <AccountInfo {...props} />,
        <IgnoredUsers {...props} />,
        <GoldenPassInfo {...props} />,
        <About {...props} />,
      ];
    } else if (isGolden || isMod) {
      return [
        <AccountInfo {...props} />,
        <IgnoredUsers {...props} />,
        <GoldenPassInfo {...props} />,
        <About {...props} />,
      ];
    } else {
      return [
        <AccountInfo {...props} />,
        <IgnoredUsers {...props} />,
        <About {...props} />,
      ];
    }
  };

  const actions = getActionsComponents();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return shouldCollapseMenu ? (
    <>
      <IconButton
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size="small"
        color="secondary"
        id="menu-button"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        PaperProps={{ sx: { backgroundColor: "primary.900" } }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "menu-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "primary.700",
            backgroundImage: "none",
            left: "0px !important",
          },
        }}
      >
        {actions.map((action, i) => (
          <MenuItem key={i}>{action}</MenuItem>
        ))}
      </Menu>
    </>
  ) : (
    <>
      {actions.map((action, i) => (
        <React.Fragment key={i}> {action} </React.Fragment>
      ))}
    </>
  );
};

export default Actions;
