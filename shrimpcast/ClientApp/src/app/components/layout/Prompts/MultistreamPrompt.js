import { red } from "@mui/material/colors";
import NotificationBar from "./NotificationBar";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { useNavigate } from "react-router-dom";

const MultistreamPrompt = ({ streamStatus }) => {
  const navigate = useNavigate();

  const navigateToRoot = () => {
    navigate("/");
  };

  return (
    <>
      <NotificationBar
        onClick={navigateToRoot}
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
