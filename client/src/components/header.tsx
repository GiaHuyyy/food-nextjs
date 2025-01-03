import React from "react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import ButtonLogout from "./button-logout";

export default async function Header() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Link className="hover:text-blue-500" href="/">
        Home
      </Link>
      <div className="flex items-center">
        <ul className="flex items-center space-x-6 mr-6">
          <li className="hover:text-blue-500">
            <Link href="/login">Đăng nhập</Link>
          </li>
          <li className="hover:text-blue-500">
            <Link href="/register">Đăng ký</Link>
          </li>
          <li>
            <ButtonLogout />
          </li>
        </ul>
        <ModeToggle />
      </div>
    </div>
  );
}
