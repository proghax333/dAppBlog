import React from "react";
import AppRouter from "./AppRouter";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import Web3Loader from "./modules/loaders/Web3Loader";
import ContractsLoader from "./modules/loaders/ContractsLoader";
import loadContracts from "./modules/contracts/loadContracts";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import LoadingStatus from "./ui/LoadingStatus";

import "./App.css";

function getLibrary(provider) {
  return new Web3(provider);
}

const theme = createTheme();
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3Loader
          waitForLoading={true}
          loadingComponent={<LoadingStatus message="Connecting to Web3..." />}
        >
          <ContractsLoader
            loader={loadContracts}
            waitForLoading={true}
            loadingComponent={
              <LoadingStatus message="Loading Smart Contracts..." />
            }
          >
            <AppRouter />
          </ContractsLoader>
        </Web3Loader>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
