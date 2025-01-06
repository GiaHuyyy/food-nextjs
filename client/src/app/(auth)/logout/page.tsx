"use client";
import authApiRequest from "@/apiResquests/auth";
import { clientSessionToken } from "@/lib/http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");
  useEffect(() => {
    if (sessionToken === clientSessionToken.value) {
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        router.push(`/login?redirectFrom=${pathname}`);
      });
    }
  }, [sessionToken, router, pathname]);
  return <div>Logout</div>;
}
