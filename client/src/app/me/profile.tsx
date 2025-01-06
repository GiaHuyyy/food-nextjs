"use client";
import accountApiResquest from "@/apiResquests/account";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import React from "react";

export default function Profile() {
  console.log("dfd1");
  React.useEffect(() => {
    const fetchRequest = async () => {
      try {
        if (clientSessionToken.value) {
          const result = await accountApiResquest.meClient();
          console.log(result);
        }
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    fetchRequest();
  }, []);
  return <div>profile</div>;
}
