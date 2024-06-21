import ErrorAlert from "./ErrorAlert";

const FallbackError = ({ error }) => {
  const message = `O seguinte runtime error ocorreu: ${error.stack}. Por favor reporta esta mensagem (${process.env.REACT_APP_VERSION}).`;
  return <ErrorAlert disconnectMessage={message} />;
};

export default FallbackError;
