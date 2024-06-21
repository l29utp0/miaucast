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
  const { disconnectMessage } = props,
    isCountdown = disconnectMessage && new Date(disconnectMessage).toString() !== "Data Inválida";

  return (
    <Container sx={Centered}>
      <Alert severity={isCountdown ? "info" : "error"}>
        {isCountdown ? (
          <CountdownTimer timestamp={disconnectMessage} />
        ) : disconnectMessage ? (
          disconnectMessage
        ) : (
          "Não foi possível estabelecer uma ligação com o servidor. Refresca para tentar outra vez."
        )}
      </Alert>
    </Container>
  );
};

export default ErrorAlert;
