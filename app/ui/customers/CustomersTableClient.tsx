"use client";

import { CustomersTableType } from "@/app/lib/definitions";
import Link from "next/link";
import React, { useContext } from "react";
import { UpdateCustomer, DeleteCustomer } from "./buttons";
import Image from "next/image";
import { ThemeContext } from "@/app/ThemeRegistry";

const CustomersTableClient = ({
  session,
  customers,
}: {
  session: any;
  customers: CustomersTableType[];
}) => {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const textSubtle = isDark ? "text-gray-400" : "text-gray-500";
  const bg = isDark ? "bg-gray-900" : "bg-white";

  const rowBorder = isDark ? "border-gray-700" : "border-gray-200";
  const linkColor = isDark ? "text-blue-200" : "text-blue-800";

  const isAdmin = session?.user.role === "admin";

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div
          className={`px-6 py-4 rounded-xl border border-gray-500 shadow-sm transition-colors ${bg} ${textColor}`}
        >
          {/* MOBILE */}
          <div className="md:hidden">
            {customers?.map((customer) => (
              <div
                key={customer.id}
                className={`mb-3 rounded-lg p-4 transition-colors ${bg}`}
              >
                {/* Top section */}
                <div
                  className={`flex items-center justify-between border-b pb-4 ${rowBorder}`}
                >
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <Image
                        src={customer.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${customer.name}'s profile picture`}
                      />
                      <p>{customer.name}</p>
                    </div>
                    <p className={`text-sm ${textSubtle}`}>{customer.email}</p>
                  </div>
                </div>

                {/* Stats */}
                <div
                  className={`flex justify-between py-4 border-b ${rowBorder}`}
                >
                  <div>
                    <p className={`text-xs ${textSubtle}`}>Pending</p>
                    <p className="font-medium">{customer.total_pending}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${textSubtle}`}>Paid</p>
                    <p className="font-medium">{customer.total_paid}</p>
                  </div>
                </div>

                {/* Link */}
                <div className={`py-3 text-center ${linkColor}`}>
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    Show more
                  </Link>
                </div>

                {/* Footer admin actions */}
                <div className="pt-4 text-sm">
                  <p>{customer.total_invoices} invoices</p>

                  {isAdmin && (
                    <div className="flex justify-end gap-3 mt-2">
                      <UpdateCustomer id={customer.id} />
                      <DeleteCustomer id={customer.id} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <table
            className={`hidden min-w-full md:table transition-colors ${textColor}`}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Total Invoices",
                  "Total Pending",
                  "Total Paid",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-5 font-medium text-left first:pl-6"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-4 py-5"></th>
                {isAdmin && <th className="px-4 py-5"></th>}
              </tr>
            </thead>

            <tbody className={`transition-colors ${bg}`}>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className={`border-b ${rowBorder} last:border-none text-sm`}
                >
                  <td className="whitespace-nowrap py-5 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={customer.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${customer.name}'s profile picture`}
                      />
                      <p>{customer.name}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    {customer.email}
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    {customer.total_invoices}
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    {customer.total_pending}
                  </td>

                  <td className="whitespace-nowrap px-4 py-5">
                    {customer.total_paid}
                  </td>

                  <td
                    className={`whitespace-nowrap text-center py-3 ${linkColor}`}
                  >
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      Show more
                    </Link>
                  </td>

                  {isAdmin && (
                    <td className="whitespace-nowrap py-3 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateCustomer id={customer.id} />
                        <DeleteCustomer id={customer.id} />
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

export default CustomersTableClient;
