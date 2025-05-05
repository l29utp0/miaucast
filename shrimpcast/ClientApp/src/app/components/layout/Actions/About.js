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
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const About = (props) => {
  const [open, setOpen] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const emailAddress = "l29utp0@pm.me";

  const setClosed = () => setOpen(false);
  const setOpened = () => setOpen(true);
  const closeToast = () => setShowCopyToast(false);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyToast(true);
    } catch (error) {
      console.error(`Falha ao copiar ${type}.`);
    }
  };

  const ContactBox = ({ icon: Icon, text, type, tooltip }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "primary.800",
        padding: 2,
        borderRadius: 1,
        mb: 2,
      }}
    >
      <Tooltip
        title={tooltip}
        placement="top"
        enterDelay={200}
        leaveDelay={200}
        arrow
      >
        <Icon color="secondary" />
      </Tooltip>
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          fontFamily: "monospace",
          letterSpacing: "0.5px",
          wordBreak: "break-all",
          fontSize: type === "endereço Session" ? "6pt" : "inherit",
        }}
      >
        {text}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<ContentCopyIcon />}
        onClick={() => copyToClipboard(text, type)}
      >
        Copiar
      </Button>
    </Box>
  );

  return (
    <>
      <Tooltip title="Info">
        <IconButton
          onClick={setOpened}
          type="button"
          size="small"
          sx={{ backgroundColor: "primary.700", borderRadius: "0px" }}
        >
          <InfoIcon sx={{ color: "primary.300" }} />
        </IconButton>
      </Tooltip>

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
              Acerca
            </Box>
            <Divider />
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {/* Logo/Image Section
              <Grid item xs={12} display="flex" justifyContent="center">
                <Avatar
                  src="/images/logo.avif"
                  alt="Logo"
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 1,
                    border: "2px solid",
                    borderColor: "secondary.main",
                  }}
                />
              </Grid>*/}

              {/* Description Section */}
              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  Bem-vindo ao miau.gg, aqui podes fazer stream, ver e
                  participar.
                </Typography>
                <Typography variant="body1" paragraph>
                  Podes instalar a app abrindo o endereço no navegador e depois
                  indo às opções e carregando em algo como "instalar",
                  "adicionar ao ecrã principal", etc.
                </Typography>
                <Typography variant="body1" paragraph>
                  Todas as mensagens do chat desaparecem passadas 24 horas.
                </Typography>
                <Typography variant="body1" paragraph>
                  Se estiveres interessado em fazer algo diferente ou especial
                  por aqui regularmente podes enviar-me um email que eu dou-te o
                  teu próprio canal e endereço para stream na plataforma.
                </Typography>
                <Typography variant="h6" paragraph>
                  Regras:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1">
                      Proibido coisas ilegais.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Proibido ocupar o stream apenas por ocupar.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Proibido qualquer coisa que ponha em causa o normal
                      funcionamento da plataforma.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1">
                      Podem pedir doações DENTRO do vosso stream, não no chat.
                    </Typography>
                  </li>
                </ul>
              </Grid>

              {/* Links Section */}
              <Grid item xs={12}>
                <Typography variant="h6" paragraph>
                  Links úteis:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

                  <Link
                    href="https://github.com/l29utp0/ptchinacast"
                    target="_blank"
                    color="secondary"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Source
                  </Link>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" paragraph>
                  Amigos:
                </Typography>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                ></Box>
                <Link
                  href="https://ptchan.org"
                  target="_blank"
                  color="secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  ptchan.org
                </Link>
              </Grid>

              {/* Contact Section */}
              <Grid item xs={12}>
                <Typography variant="h6" paragraph>
                  Contacto:
                </Typography>

                <ContactBox
                  icon={EmailIcon}
                  text={emailAddress}
                  type="Email"
                  tooltip="Email"
                />

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
          Copiado!
        </Alert>
      </Snackbar>
    </>
  );
};

export default About;
