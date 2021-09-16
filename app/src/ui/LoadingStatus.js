import React from "react";
import { CircularProgress, Alert, AlertTitle, Container } from "@mui/material";

function LoadingStatus({ message, severity = "info", done = false }) {
  return (
    <Container
      sx={{
        padding: "2rem",
      }}
    >
      <Alert severity={severity}>
        <AlertTitle
          sx={{
            marginBottom: 0,
          }}
        >
          {message}
        </AlertTitle>
        {!done && (
          <div
            style={{
              margin: "0.4rem 0 0 0",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </Alert>
    </Container>
  );
}
export default LoadingStatus;
