"use client";
import { clientSesstionToken } from "@/lib/http";
import { useState } from "react";

export default function AppProvider({
  children,
  initialSesstionToken = "",
}: {
  children: React.ReactNode;
  initialSesstionToken?: string;
}) {
  useState(() => {
    if (typeof window !== "undefined") {
      clientSesstionToken.value = initialSesstionToken;
    }
  });
  return <>{children}</>;
}
