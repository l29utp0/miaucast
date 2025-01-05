import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LocalStorageManager from "../../../managers/LocalStorageManager";
import TokenManager from "../../../managers/TokenManager";

const CopySx = {
    mt: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ToggleSx = {
    width: "70%",
    wordWrap: "break-word",
    cursor: "pointer",
  };

const AccountInfo = (props) => {
  const [open, setOpen] = useState(false),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [isLoading, setLoading] = useState(false),
    [isHidden, setHidden] = useState(true),
    [importToken, setImportToken] = useState(""),
    sessionToken = LocalStorageManager.getToken();

  const handleOpen = () => setOpen(true),
    handleClose = () => setOpen(false),
    closeToast = () => setShowToast(false),
    displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    toggleHidden = () => setHidden(!isHidden),
    changeInput = (e) => setImportToken(e.target.value);

  const submitTokenChange = async () => {
    if (!importToken || isLoading) return;
    setLoading(true);
    const response = await TokenManager.Import(props.signalR, importToken);
    setLoading(false);
    if (!response) displayToast("Erro: token inválido.");
  };

  const handleKeys = async (e) =>
    e.key === "Enter" && (await submitTokenChange());
  const copyToken = () =>
    navigator.clipboard
      .writeText(sessionToken)
      .then(() => displayToast("Token copiado para o clipboard!"))
      .catch(() => displayToast("Erro ao copiar token."));

  useEffect(() => {
    return () => {
      setHidden(true);
      setImportToken("");
    };
  }, [open]);

  return (
    <>
      <IconButton onClick={handleOpen} size="small" color="secondary">
        <AccountCircleIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { backgroundColor: "primary.900" } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="div">
              Sessão
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            O teu token de sessão (Não o partilhes com ninguém!):
          </Typography>
          <Box sx={CopySx}>
            <Typography variant="body2" sx={ToggleSx} onClick={toggleHidden}>
              {isHidden
                ? `${"*".repeat(sessionToken.length)} (clica para ver)`
                : sessionToken}
            </Typography>
            <Button
              onClick={copyToken}
              size="small"
              variant="contained"
              color="secondary"
              startIcon={<ContentCopyIcon />}
            >
              Copiar
            </Button>
          </Box>
          <Box mt={2}>
            <Typography variant="h6" component="div" gutterBottom>
              Importar token de sessão
            </Typography>
            <OutlinedInput
              fullWidth
              size="small"
              type="text"
              placeholder="Cola o teu token..."
              value={importToken}
              onChange={changeInput}
              onKeyDown={handleKeys}
              endAdornment={
                <InputAdornment position="end">
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <IconButton onClick={submitTokenChange} edge="end">
                      <SendIcon color="secondary" />
                    </IconButton>
                  )}
                </InputAdornment>
              }
            />
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
        <Alert
          severity={toastMessage.includes("Error") ? "error" : "success"}
          variant="filled"
          p={2}
        >
          <Typography variant="body2">{toastMessage}</Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default AccountInfo;
