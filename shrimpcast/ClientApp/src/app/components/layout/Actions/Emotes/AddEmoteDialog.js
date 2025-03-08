import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Snackbar, Typography, Alert, CircularProgress } from "@mui/material";
import EmoteManager from "../../../../managers/EmoteManager";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddEmoteDialog = (props) => {
  const [emote, setEmote] = useState(null),
    [name, setName] = useState(""),
    [showToast, setShowToast] = useState(false),
    [toastMessage, setToastMessage] = useState(""),
    [loading, setLoading] = useState(false),
    closeToast = () => setShowToast(false),
    displayToast = (message) => {
      setToastMessage(message);
      setShowToast(true);
    },
    handleClose = () => {
      setEmote(null);
      setName("");
    },
    handleFileChange = (e) => {
      const file = e.target.files[0];
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/avif",
      ];
      if (!file) {
        handleClose();
        return;
      }

      if (!validImageTypes.includes(file.type)) {
        displayToast(
          "Erro: seleciona um tipo de imagem válido (JPG, PNG, GIF, WEBP, AVIF).",
        );
        handleClose();
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width > 100 || img.height > 70) {
          displayToast("Erro: resolução não pode exceder 70x70 pixels.");
          setEmote(null);
        } else {
          setEmote(file);
        }
      };
      img.src = URL.createObjectURL(file);
      setName(file.name.replace(/\.[^/.]+$/, ""));
    },
    handleSubmit = async () => {
      setLoading(true);
      const response = await EmoteManager.Add(emote, name);
      setLoading(false);
      if (!response) {
        displayToast("Erro: Não foi possível adicionar o emote.");
        return;
      }

      props.setEmotes((emotes) => emotes.concat(response));
      handleClose();
      props.close();
    };

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      PaperProps={{ sx: { backgroundColor: "primary.900" } }}
    >
      <DialogTitle>Add new emote</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome emote"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />
        <Button
          component="label"
          sx={{ width: "100%" }}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file {emote?.name && `(${emote.name})`}
          <VisuallyHiddenInput
            accept="image/jpeg, image/png, image/gif, image/webp, image/avif"
            onChange={handleFileChange}
            type="file"
          />
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Cancelar</Button>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Button onClick={handleSubmit} disabled={!emote || !name}>
            Add
          </Button>
        )}
      </DialogActions>
      <Snackbar open={showToast} autoHideDuration={5000} onClose={closeToast}>
        <Alert
          severity={toastMessage.includes("Error") ? "error" : "success"}
          variant="filled"
          p={2}
        >
          <Typography variant="body2">{toastMessage}</Typography>
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddEmoteDialog;
