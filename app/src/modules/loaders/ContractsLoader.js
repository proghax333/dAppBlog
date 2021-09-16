import React, { useEffect, useState, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

export const ContractsContext = createContext();

export default function ContractsLoader({
  loader = () => {},
  children,
  waitForLoading = false,
  loadingComponent = <></>,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [contracts, setContracts] = useState({});
  const web3ReactState = useWeb3React();

  const { active, library } = web3ReactState;

  useEffect(() => {
    if (active && !loaded) {
      async function load() {
        const contracts = await loader(web3ReactState);

        setContracts(contracts);
        setLoaded(true);
      }
      load();
    }
  }, [loaded, active, library, loader, web3ReactState]);

  const value = {
    loaded,
    contracts,
    waitForLoading,
  };

  return (
    <ContractsContext.Provider value={value}>
      {waitForLoading ? (loaded && children) || loadingComponent : children}
    </ContractsContext.Provider>
  );
}
