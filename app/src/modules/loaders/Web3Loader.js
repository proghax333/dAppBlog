import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connector";

export default function Web3Loader({
  connector = injected,
  children,
  waitForLoading = false,
  loadingComponent = <></>,
  ...props
}) {
  const { active, activate } = useWeb3React();
  useEffect(() => {
    async function activateWeb3() {
      if (!active) {
        await activate(connector);
      }
    }
    activateWeb3();
  }, [active, activate, connector]);

  return (
    <>{waitForLoading ? (active && children) || loadingComponent : children}</>
  );
}
