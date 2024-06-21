import React from "react";
import BlockIcon from "@mui/icons-material/Block";
import AdminActionsManager from "../../../managers/AdminActionsManager";
import ChatActionsManager from "../../../managers/ChatActionsManager";
import GenericActionList from "./GenericActionList";

const Bans = (props) => {
  return (
    <GenericActionList
      title="Lista de utilizadores banidos"
      getItems={AdminActionsManager.GetBans}
      removeItem={ChatActionsManager.Unban}
      icon={BlockIcon}
      identifier="banId"
      contentIdentifier="sessionName"
      {...props}
    />
  );
};

export default Bans;
