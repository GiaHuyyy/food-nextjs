import React from "react";
import { cookies } from "next/headers";
import accountApiResquest from "@/apiResquests/account";
import Profile from "./profile";

export default async function GetMeProfile() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken");

  const result = await accountApiResquest.me(sessionToken?.value ?? "");
  return (
    <div>
      <h1>Me</h1>
      <p>Xin chào {result.payload?.data?.name}</p>
      <Profile />
    </div>
  );
}
