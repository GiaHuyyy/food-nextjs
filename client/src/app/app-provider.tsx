"use client";
import { useState } from "react";
import { clientSessionToken } from "@/lib/http";

export default function AppProvider({
  children,
  initialSessionToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
}) {
  console.log("abc");
  useState(() => {
    if (typeof window !== "undefined") {
      console.log("abcdef", initialSessionToken);
      clientSessionToken.value = initialSessionToken;
      console.log("abcd", clientSessionToken);
    }
  });
  return <>{children}</>;
}
