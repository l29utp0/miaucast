import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Divider,
  Typography,
  Link,
  Grid,
  Avatar,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmailIcon from "@mui/icons-material/Email";

const About = (props) => {
  const [open, setOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const setClosed = () => setOpen(false);
  const setOpened = () => setOpen(true);
  const closeToast = () => setShowCopyToast(false);

  const emailAddress = "info@ptchan.org";

  const copyEmail = () => {
    navigator.clipboard
      .writeText(emailAddress)
      .then(() => setShowCopyToast(true))
      .catch(() => console.error("Falha ao copiar email."));
  };

  return (
    <>
      <IconButton
        onClick={setOpened}
        type="button"
        size="small"
        sx={{ borderRadius: "0px" }}
      >
        <InfoIcon sx={{ color: "secondary.main" }} />
      </IconButton>

      {open && (
        <Dialog
          open={open}
          onClose={setClosed}
          maxWidth={"sm"}
          fullWidth
          PaperProps={{ sx: { backgroundColor: "primary.900" } }}
        >
          <DialogTitle sx={{ fontSize: "24px", pb: "7.5px" }}>
            <Box display="flex" width="100%" mb={"10px"}>
              Acerca do stream
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Logo/Image Section */}
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  src="/images/logo.png"
                  alt="Logo"
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 2,
                    border: "2px solid",
                    borderColor: "secondary.main",
                  }}
                />
              </Grid>

              {/* Description Section */}
              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  Bem-vindo ao stream do ptchina, aqui podes fazer stream, ver e
                  participar.
                </Typography>
                <Typography variant="body1" paragraph>
                  Esta plataforma tem:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      Stream com chat em tempo real
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">Votações e bingo</Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Emotes e outras funções
                    </Typography>
                  </li>
                </ul>
              </Grid>

              {/* Links Section */}
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary.main" gutterBottom>
                  Links úteis:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Link
                    href="https://ptchan.org/av/custompage/stream.html"
                    target="_blank"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Como fazer stream
                  </Link>

                  <Link
                    href="https://ptchan.org"
                    target="_blank"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Visita o ptchan
                  </Link>
                </Box>
              </Grid>

              {/* Contact Section */}
              <Grid item xs={12}>
                <Typography variant="h6" color="secondary.main" gutterBottom>
                  Contacto:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "primary.800",
                    padding: 2,
                    borderRadius: 1,
                  }}
                >
                  <EmailIcon color="secondary" />
                  <Typography
                    variant="body1"
                    sx={{
                      flexGrow: 1,
                      fontFamily: "monospace",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {emailAddress}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyEmail}
                  >
                    Copiar
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1 }}
                >
                  DMCA, informações, questões legais, etc...
                </Typography>
              </Grid>

              {/* Version Info */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  Versão: {process.env.REACT_APP_VERSION}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast notification for email copy */}
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
          Email copiado!
        </Alert>
      </Snackbar>
    </>
  );
};

export default About;
