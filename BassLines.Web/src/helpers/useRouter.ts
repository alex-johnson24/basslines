import { useContext } from "react";
// @ts-ignore
import { __RouterContext } from "react-router";

export function useRouter() {
  return useContext(__RouterContext);
}