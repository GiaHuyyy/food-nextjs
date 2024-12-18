import React from "react";

export default function AuthLayout({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <div className="flex flex-col items-center mt-5">{children}</div>;
}
