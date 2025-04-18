import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
} from "@mui/material";

const TableSx = {
    borderRadius: "5px",
    mt: "20px",
    padding: "15px",
  },
  StatusLoaderSx = {
    position: "relative",
    left: "5px",
    top: "2px",
  },
  InvoicesLoaderSx = {
    textAlign: "center",
    width: "100%",
    mt: "5px",
  };

const InvoiceTable = ({ invoices, setCheckoutUrl }) => {
  return (
    <TableContainer component={Paper} sx={TableSx}>
      <Typography textAlign="center" variant="h5" component="h5" gutterBottom>
        Invoices
      </Typography>
      <Divider />
      {invoices ? (
        invoices.length ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Checkout</TableCell>
                <TableCell>Criado a</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {invoice.status}
                    {(invoice.status === "Processing" || invoice.status === "New") && (
                      <CircularProgress size={12} sx={StatusLoaderSx} />
                    )}
                  </TableCell>
                  <TableCell>{invoice.isStripe ? "Stripe" : "Crypto"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        invoice.isStripe
                          ? window.open(invoice.checkoutLink, "_self")
                          : setCheckoutUrl(invoice.checkoutLink)
                      }
                    >
                      abrir
                    </Button>
                  </TableCell>
                  <TableCell>{new Date(invoice.createdTime * 1000).toLocaleString('en-GB')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography mt="5px">Sem nada encontrado.</Typography>
        )
      ) : (
        <Box sx={InvoicesLoaderSx}>
          <CircularProgress size={36} />
        </Box>
      )}
    </TableContainer>
  );
};

export default InvoiceTable;
