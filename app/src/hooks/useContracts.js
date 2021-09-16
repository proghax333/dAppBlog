import { useContext } from "react";
import { ContractsContext } from "../modules/loaders/ContractsLoader";

export function useContracts() {
  const contextState = useContext(ContractsContext);
  return contextState;
}
