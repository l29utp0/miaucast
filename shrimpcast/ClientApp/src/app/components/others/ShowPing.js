import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import PingManager from "../../managers/PingManager";
import SignalRManager from "../../managers/SignalRManager";

const ShowPing = (props) => {
  const { signalR } = props,
    [message, setMessage] = useState({}),
    handleClose = async () => {
      setMessage({});
      await PingManager.ConfirmPingReception(signalR, message.pingId, true);
    };

  useEffect(() => {
    signalR.on(SignalRManager.events.ping, async (ping) => {
      setMessage(ping);
      await PingManager.ConfirmPingReception(signalR, ping.pingId, false);
    });
    return () => signalR.off(SignalRManager.events.ping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={message?.text ? true : false} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { backgroundColor:"primary.900" }}}>
      <DialogTitle>{message?.name} enviou-te:</DialogTitle>
      <DialogContent>
        <DialogContentText>{message?.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowPing;
