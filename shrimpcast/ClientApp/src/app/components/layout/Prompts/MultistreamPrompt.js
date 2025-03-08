import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useState } from "react";
import GenericActionList from "../Actions/GenericActionList";

const MultistreamPrompt = ({ streamStatus }) => {
  const [openSwitchSource, setSwitchSource] = useState(false);

  return (
    <>
      <NotificationBar
        onClick={() => window.history.back()}
        text={`Streams`}
        icon={LiveTvIcon}
        palette={red}
        skipCloseButton={true}
        back={true}
      />
    </>
  );
};

export default MultistreamPrompt;
