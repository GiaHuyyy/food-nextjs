"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext({
  sesstionToken: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSesstionToken: (sesstionToken: string) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialSesstionToken = "",
}: {
  children: React.ReactNode;
  initialSesstionToken?: string;
}) {
  const [sesstionToken, setSesstionToken] = useState(initialSesstionToken);
  return <AppContext.Provider value={{ sesstionToken, setSesstionToken }}>{children}</AppContext.Provider>;
}
