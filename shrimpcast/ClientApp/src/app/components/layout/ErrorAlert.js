import { Alert, Container } from "@mui/material";
import CountdownTimer from "../others/CountdownTimer";
import CloudflareTurnstile from "../others/CloudflareTurnstile";

const Centered = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%);",
  webkitTransform: "translate(-50%, -50%);",
};

const ErrorAlert = (props) => {
  const { disconnectMessage } = props,
    isCountdown = disconnectMessage && new Date(disconnectMessage).toString() !== "Invalid Date",
    turnstileMode = disconnectMessage === "TURNSTILE_VERIFICATION_REQUIRED";

  return (
    <Container sx={Centered}>
      {turnstileMode ? (
        <CloudflareTurnstile {...props} />
      ) : (
        <Alert severity={isCountdown ? "info" : "error"}>
          {isCountdown ? (
            <CountdownTimer timestamp={disconnectMessage} />
          ) : disconnectMessage ? (
            disconnectMessage
          ) : (
            "Não foi possível estabelecer uma ligação com o servidor. Refresca para tentar outra vez."
          )}
        </Alert>
      )}
    </Container>
  );
};

export default ErrorAlert;
