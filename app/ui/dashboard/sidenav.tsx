"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import ThemeToggle from "../ThemeToggle";
import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeRegistry";

export default function SideNav() {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  return (
    <div
      className={`flex h-full flex-col px-3 py-4 md:px-2 transition-colors ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Link
        className={`mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40 transition-colors ${
          isDark ? "bg-blue-800" : "bg-blue-600"
        }`}
        href="/"
      >
        <div className="w-32 md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div
          className={`hidden h-auto w-full grow rounded-md md:block transition-colors ${
            isDark ? "bg-gray-800" : "bg-gray-50"
          }`}
        ></div>

        <form
          action={async () => {
            await fetch("/api/signout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          <div className="flex justify-end p-4 md:justify-start md:p-2">
            <ThemeToggle />
          </div>

          <button
            className={`flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 transition-colors ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-white"
                : "bg-gray-50 hover:bg-sky-100 text-gray-900 hover:text-blue-600"
            }`}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
