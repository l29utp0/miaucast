import React, { useEffect, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Box, DialogContent, Divider, Typography, Button, CircularProgress, Snackbar, Alert } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import TokenManager from "../../../managers/TokenManager";
import InvoiceTable from "./InvoiceTable";

const DialogSx = {
    borderRadius: "10px",
    boxShadow: 24,
    bgcolor: "#424242",
  },
  DialogTitleSx = {
    fontSize: "22px",
    pb: "10px",
    fontWeight: "bold",
    color: "#fff",
    bgcolor: "primary.800",
  },
  DialogContentSx = {
    padding: "20px",
    bgcolor: "primary.900",
    borderRadius: "5px",
  },
  BuyButtonSx = {
    bgcolor: "#ffca28",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    "&:hover": {
      bgcolor: "#e68900",
    },
  },
  InvoiceSx = {
    height: "520px",
    border: "none",
    width: "334px",
  };

const GoldenPassDialog = (props) => {
  const { closeDialog, configuration, goldenPassTitle, signalR } = props,
    [loading, setLoading] = useState(false),
    [invoices, setInvoices] = useState(null),
    [toastMessage, setToastMessage] = useState(""),
    [showToast, setShowToast] = useState(false),
    closeToast = () => setShowToast(false),
    [checkoutUrl, setCheckoutUrl] = useState(""),
    closeCheckoutDialog = () => setCheckoutUrl(""),
    getInvoices = async () => {
      const invoices = await TokenManager.GetSessionInvoices(signalR);
      setInvoices(invoices);
    },
    beginPurchase = async () => {
      setLoading(true);
      const response = await TokenManager.BeginGoldenPassPurchase(signalR);
      setLoading(false);
      if (!response || response.includes("Error")) {
        setToastMessage(response || "Erro: não foi possível completar.");
        setShowToast(true);
        return;
      }

      setCheckoutUrl(response);
      getInvoices();
    };

  useEffect(() => {
    getInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dialog open={true} onClose={closeDialog} maxWidth={"sm"} fullWidth PaperProps={{ sx: DialogSx }}>
        <DialogTitle sx={DialogTitleSx}>
          ADQUIRE O TEU {goldenPassTitle}{" "}
          <Typography variant="span" color="#ffca28">
            <WorkspacePremiumIcon sx={{ position: "relative", top: "5px" }} />
          </Typography>
          <Divider color="#FFF" />
        </DialogTitle>
        <DialogContent sx={DialogContentSx}>
          <Typography variant="body1" marginTop="5px">
            Faz uma doação e adquire o teu {goldenPassTitle} se quiseres apoiar o stream e desfruta de benefícios como:
          </Typography>
          <Box marginTop="10px" mb={3}>
            <Typography variant="body2" className="golden-glow">
              - Nome de OURO.
            </Typography>
            <Typography variant="body2">- Duração iliminata, sem subscrições, wow! </Typography>
            <Typography variant="body2">- Uma certa resistência a bans.</Typography>
            <Typography variant="body2">- Um abraço virtual!</Typography>
            <Typography variant="body2">- Lembra-te de guardar o teu token de sessão (canto superior esquerdo).</Typography>
          </Box>
          <Box justifyContent="center" display="flex">
            <Button disabled={loading} onClick={beginPurchase} variant="contained" sx={BuyButtonSx}>
              Adquire (USD ${configuration.goldenPassValue}){" "}
              {loading && <CircularProgress color="primary" sx={{ ml: "10px" }} size={14} />}
            </Button>
          </Box>

          <InvoiceTable invoices={invoices} setCheckoutUrl={setCheckoutUrl} />
        </DialogContent>
      </Dialog>
      {showToast && (
        <Snackbar open={showToast} autoHideDuration={7500} onClose={closeToast}>
          <Alert
            severity={toastMessage.includes("Enabled") ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toastMessage}
          </Alert>
        </Snackbar>
      )}
      {checkoutUrl && (
        <Dialog open={true} onClose={closeCheckoutDialog} sx={{ borderRadius: "5px" }}>
          <iframe style={InvoiceSx} src={checkoutUrl} title="checkout-page" />
        </Dialog>
      )}
    </>
  );
};

export default GoldenPassDialog;