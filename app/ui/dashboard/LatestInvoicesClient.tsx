"use client";

import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/app/ui/fonts";
import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeRegistry";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type LatestInvoice = {
  id: string;
  name: string;
  email: string;
  amount: number | string;
  image_url: string;
};

export default function LatestInvoicesClient({
  latestInvoices,
}: {
  latestInvoices: LatestInvoice[];
}) {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2
        className={`${lusitana.className} mb-4 text-xl md:text-2xl ${
          isDark ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Latest Invoices
      </h2>

      <div
        className={`flex grow flex-col justify-between rounded-xl p-4 transition-colors ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`px-6 transition-colors ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {latestInvoices.map((invoice, i) => (
            <div
              key={invoice.id}
              className={clsx(
                "flex flex-row items-center justify-between py-4",
                { "border-t": i !== 0 },
                isDark ? "border-gray-700" : "border-gray-200"
              )}
            >
              <div className="flex items-center">
                <Image
                  src={invoice.image_url}
                  alt={`${invoice.name}'s profile picture`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                />
                <div className="min-w-0">
                  <p
                    className={clsx(
                      "truncate text-sm font-semibold md:text-base",
                      isDark ? "text-gray-100" : "text-gray-900"
                    )}
                  >
                    {invoice.name}
                  </p>
                  <p
                    className={clsx(
                      "hidden text-sm sm:block",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {invoice.email}
                  </p>
                </div>
              </div>
              <p
                className={`${
                  lusitana.className
                } truncate text-sm font-medium md:text-base ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {invoice.amount}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon
            className={`h-5 w-5 transition-colors ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          />
          <h3
            className={`ml-2 text-sm transition-colors ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Updated just now
          </h3>
        </div>
      </div>
    </div>
  );
}
