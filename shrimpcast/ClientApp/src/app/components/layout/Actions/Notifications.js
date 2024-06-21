import NotificationsIcon from "@mui/icons-material/Notifications";
import ConfirmDialog from "../../others/ConfirmDialog";
import { useState } from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import ServiceWorkerManager from "../../../managers/ServiceWorkerManager";

const Notifications = (props) => {
  const [open, setOpen] = useState(false),
    setClosed = () => setOpen(false),
    setOpened = () => setOpen(true),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [isLoading, setLoading] = useState(false),
    closeToast = () => setShowToast(false),
    dispatchNotifications = async () => {
      setLoading(true);
      const response = await ServiceWorkerManager.DispatchNotifications(props.signalR);
      setLoading(false);
      if (response) {
        setToastMessage(response);
        setShowToast(true);
        setClosed();
      }
    };

  return (
    <>
      <IconButton onClick={setOpened} type="button" size="small" sx={{ borderRadius: "0px" }}>
        <NotificationsIcon sx={{ color: "primary.500" }} />
      </IconButton>
      {open && (
        <ConfirmDialog
          isLoading={isLoading}
          title="Notificar utilizadores do inicio do stream?"
          confirm={dispatchNotifications}
          cancel={setClosed}
        />
      )}
      {showToast && (
        <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Notifications;
