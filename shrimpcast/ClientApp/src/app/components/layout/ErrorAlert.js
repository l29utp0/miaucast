import { Alert, Container } from "@mui/material";
import CountdownTimer from "../others/CountdownTimer";

const Centered = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%);",
  webkitTransform: "translate(-50%, -50%);",
};

const ErrorAlert = (props) => {
  const { disconnectMessage } = props;

  // Only treat it as a countdown if it's a valid future timestamp
  const isCountdown =
    disconnectMessage &&
    !isNaN(Date.parse(disconnectMessage)) &&
    new Date(disconnectMessage) > new Date();

  return (
    <Container sx={Centered}>
      <Alert severity={isCountdown ? "info" : "error"}>
        {isCountdown ? (
          <CountdownTimer timestamp={disconnectMessage} />
        ) : (
          disconnectMessage ||
          "Não foi possível estabelecer uma ligação com o servidor. Refresca para tentar outra vez."
        )}
      </Alert>
    </Container>
  );
};

export default ErrorAlert;
