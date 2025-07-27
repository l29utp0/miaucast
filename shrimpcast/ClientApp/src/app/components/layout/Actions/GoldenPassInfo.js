
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Divider,
  Typography,
  Button,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const GoldenPassInfo = (props) => {
  const [open, setOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copiedItem, setCopiedItem] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const closeToast = () => setShowCopyToast(false);

  const copyToClipboard = async (text, itemName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemName);
      setShowCopyToast(true);
    } catch (error) {
      console.error(`Failed to copy ${itemName}.`);
    }
  };

  // Use your predefined RTMP information
  const rtmpUrl = process.env.REACT_APP_STREAM_URL || "Stream URL not set";
  const streamKey = process.env.REACT_APP_STREAM_KEY || "Stream key not set";
  const chatOverlay = process.env.REACT_APP_CHATOVERLAY || "Chat overlay not set";


  return (
    <>
      <Tooltip title="Douradinhos">
        <IconButton
          onClick={handleOpen}
          type="button"
          size="small"
          sx={{
            backgroundColor: "primary.700",
            borderRadius: "0px"
          }}
        >
          <WorkspacePremiumIcon/>
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"md"}
        fullWidth
        PaperProps={{ sx: { backgroundColor: "primary.900" } }}
      >
        <DialogTitle sx={{ fontSize: "24px", pb: "7.5px" }}>
          <Box display="flex" width="100%" mb={"10px"} alignItems="center">
            <WorkspacePremiumIcon sx={{ mr: 1, color: "#FFD700" }} />
            Douradinhos
          </Box>
          <Divider />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Como portador de douradinhos tens vários beneficios como este menu onde podes encontrar informações de como fazer stream para o /oficial entre outras coisas.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              RTMP Server URL
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.800',
                p: 1,
                borderRadius: 1
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                {rtmpUrl}
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(rtmpUrl, "RTMP URL")}
                variant="contained"
                color="secondary"
              >
                Copiar
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Stream Key
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.800',
                p: 1,
                borderRadius: 1
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                {streamKey}
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(streamKey, "Stream Key")}
                variant="contained"
                color="secondary"
              >
                Copiar
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Chat Overlay
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.800',
                p: 1,
                borderRadius: 1
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace' }}>
                {chatOverlay}
              </Typography>
              <Button
                size="small"
                startIcon={<ContentCopyIcon />}
                onClick={() => copyToClipboard(chatOverlay, "Chat Overlay")}
                variant="contained"
                color="secondary"
              >
                Copiar
              </Button>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            Tenta não partilhar :^)
          </Alert>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Configurações recomendadas:
            </Typography>
            <Typography variant="body2" component="div">
              <ul>
                <li>Vídeo: 1080p (1920x1080) a 30-60fps</li>
                <li>Bitrate: 3000-4000 Kbps</li>
                <li>Áudio: 128-160 Kbps AAC</li>
              </ul>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showCopyToast}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {copiedItem} copiado para o clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default GoldenPassInfo;
