import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useState } from "react";
import GenericActionList from "../Actions/GenericActionList";
import { useNavigate } from "react-router-dom";

const MultistreamPrompt = ({ streamStatus, goHomeOnStreamSwitch }) => {
  const [openSwitchSource, setSwitchSource] = useState(false),
    navigate = useNavigate(),
    switchStreams = () => {
      if (goHomeOnStreamSwitch) {
        navigate("/");
      } else {
        setSwitchSource(true);
      }
    };

  return (
    <>
      <NotificationBar
        onClick={switchStreams}
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
