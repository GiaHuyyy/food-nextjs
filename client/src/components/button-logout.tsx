"use client";
import React from "react";
import { Button } from "./ui/button";
import authApiRequest from "@/apiResquests/auth";
import { useRouter } from "next/navigation";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function ButtonLogout() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToNextServer();
      toast({
        description: "Đăng xuất thành công!",
        duration: 2000,
      });
      router.push("/login");
    } catch (error) {
      handleErrorApi({ error });
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout} className="text-base">
      Đăng xuất
    </Button>
  );
}
