import React, { useState, useEffect, createContext } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import loadContracts from "../../modules/contracts/loadContracts";
import Web3 from "web3";

export const EthereumContext = createContext();

export function EthereumProvider({ children, ...props }) {
  const [ethereum, setEthereum] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [web3State, setWeb3State] = useState("connecting");
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const loadProvider = async () => {
      const availableProvider = await detectEthereumProvider();

      if (availableProvider) {
        const web3 = new Web3(availableProvider);

        setContracts(await loadContracts(web3));
        setEthereum(availableProvider);
        setWeb3(web3);
        setWeb3State("connected");
      } else {
        setWeb3State("unavailable");
      }
    };
    loadProvider();
    return () => {};
  }, []);

  const value = {
    ethereum,
    web3,
    contracts,
  };

  switch (web3State) {
    case "connecting": {
      return <div>Connecting to Ethereum Network</div>;
    }
    case "connected": {
      return (
        <EthereumContext.Provider value={value}>
          {children}
        </EthereumContext.Provider>
      );
    }
    case "unavailable": {
      return <div>Install MetaMask extension for this website to work.</div>;
    }
    default: {
    }
  }
  return <></>;
}
