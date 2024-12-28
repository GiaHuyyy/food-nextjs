import React from "react";
import { cookies } from "next/headers";
import accountApiResquest from "@/apiResquests/account";

export default async function GetMeProfile() {
  const cookieStore = await cookies();
  const sesstionToken = cookieStore.get("sesstionToken");

  const result = await accountApiResquest.me(sesstionToken?.value ?? "");
  return (
    <div>
      <h1>Profile</h1>
      <p>Xin chào {result.payload?.data?.name}</p>
    </div>
  );
}
