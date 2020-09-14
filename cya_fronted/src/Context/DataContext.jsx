import React, { useMemo } from "react";
//Hooks
import { useLocalStorage } from "../Hooks";

const DataContext = React.createContext();

export function DataProvider(props) {
  const [isLoged, setIsLoged] = useLocalStorage("isLoged", false);
  const [token, setToken] = useLocalStorage("token", "");
  const [userData, setUserData] = useLocalStorage("userData", {});
  const url = "http://localhost:3001";
  const value = useMemo(() => {
    return {
      isLoged,
      setIsLoged,
      token,
      setToken,
      userData,
      setUserData,
      url,
    };
  }, [isLoged, setIsLoged, token, setToken, userData, setUserData, url]);
  return <DataContext.Provider value={value} {...props} />;
}

export function useData() {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be inside the provider DataContext");
  }
  return context;
}
