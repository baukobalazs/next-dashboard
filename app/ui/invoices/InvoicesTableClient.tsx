"use client";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeContext } from "@/app/ThemeRegistry";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { UpdateInvoice, DeleteInvoice } from "./buttons";
import InvoiceStatus from "./status";
import { InvoicesTable } from "@/app/lib/definitions";
import { hslToRgb } from "@mui/material";
import { blue } from "@mui/material/colors";

const InvoicesTableClient = ({
  session,
  invoices,
}: {
  session: any;
  invoices: InvoicesTable[];
}) => {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const textSubtle = isDark ? "text-gray-400" : "text-gray-500";
  const bgMain = isDark ? "bg-gray-900" : "bg-white";
  const bgRow = isDark ? "bg-gray-900" : "bg-white";
  const linkColor = isDark ? "text-blue-200" : "text-blue-800";

  const isAdmin = session?.user.role === "admin";

  return (
    <div className="mt-6 flow-root ">
      <div className="inline-block  min-w-full align-middle">
        <div
          className={`px-6 transition-colors ${bgMain} ${textColor} 
  border border-gray-500 rounded-xl shadow-sm`}
        >
          {/* mobil */}
          <div className="md:hidden">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className={`mb-2 w-full rounded-md p-4 transition-colors ${
                  isDark ? "bg-gray-800 " : "bg-white"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className={`text-sm ${textSubtle}`}>{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>

                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>

                  <div className={`whitespace-nowrap py-3 ${linkColor}`}>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      {isAdmin
                        ? "Show more"
                        : invoice.status === "pending"
                        ? "Payment"
                        : "Show more"}
                    </Link>
                  </div>

                  {isAdmin && (
                    <div className="flex justify-end gap-2">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* desktop */}
          <table
            className={`hidden min-w-full md:table transition-colors ${textColor}`}
          >
            <thead>
              <tr>
                {[
                  "Customer",
                  "Email",
                  "Amount",
                  "Date",
                  "Status",
                  "Deadline",
                ].map((col) => (
                  <th
                    key={col}
                    className={`px-3 py-5 font-medium ${textColor} first:pl-6`}
                  >
                    {col}
                  </th>
                ))}
                <th></th>
                {isAdmin && <th></th>}
              </tr>
            </thead>

            <tbody className={`transition-colors ${bgRow}`}>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-500 py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.deadline ? (
                      formatDateToLocal(invoice.deadline)
                    ) : (
                      <span className={textSubtle}>No deadline</span>
                    )}
                  </td>

                  <td
                    className={`whitespace-nowrap text-center py-3 ${linkColor}`}
                  >
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      {isAdmin
                        ? "Show more"
                        : invoice.status === "pending"
                        ? "Payment"
                        : ""}
                    </Link>
                  </td>

                  {isAdmin && (
                    <td className="whitespace-nowrap py-3 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateInvoice id={invoice.id} />
                        <DeleteInvoice id={invoice.id} />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesTableClient;
