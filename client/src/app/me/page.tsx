import React from "react";
import envConfig from "@/config";
import { cookies } from "next/headers";

export default async function GetMeProfile() {
  const cookieStore = await cookies();
  const sesstionToken = cookieStore.get("sesstionToken");

  const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/account/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sesstionToken?.value}`,
    },
  }).then(async (res) => {
    const payload = await res.json();
    const data = {
      status: res.status,
      payload,
    };
    if (!res.ok) {
      throw data;
    }
    return data;
  });
  console.log(result);
  return (
    <div>
      <h1>Profile</h1>
      <p>Xin chào {result.payload?.data?.name}</p>
    </div>
  );
}
