"use client";

import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeRegistry";
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const Icon = iconMap[type];

  return (
    <div
      className={`rounded-xl p-2 shadow-sm transition-colors ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="flex p-4 items-center">
        {Icon && (
          <Icon
            className={`h-5 w-5 transition-colors ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          />
        )}
        <h3
          className={`ml-2 text-sm font-medium transition-colors ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
      </div>
      <p
        className={`${
          lusitana.className
        } truncate rounded-xl px-4 py-8 text-center text-2xl transition-colors ${
          isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
