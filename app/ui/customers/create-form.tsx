"use client";

import { CustomerField, UserField } from "@/app/lib/definitions";
import Link from "next/link";
import { AtSymbolIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { createCustomer, CustomerState } from "@/app/lib/actions";
import { useActionState, useContext, useState } from "react";
import { fetchCustomerById } from "@/app/lib/data";
import { ThemeContext } from "@/app/ThemeRegistry";

export default function CustomerCreateForm({
  users,
  customers,
}: {
  users: UserField[];
  customers: CustomerField[];
}) {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);
  const [email, setEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserField | null>(null);

  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";
  return (
    <form action={formAction}>
      <div
        className={`rounded-md transition-colors ${bg} border border-gray-200 p-4 md:p-6`}
      >
        {/* User Name */}
        <div className="mb-4">
          <label htmlFor="id" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <select
              id="id"
              name="id"
              className={`peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${bg}`}
              defaultValue=""
              aria-describedby="user-error"
              onChange={(e) => {
                const selectedUser = users.find((u) => u.id === e.target.value);
                setEmail(selectedUser?.email ?? "");
                setSelectedUser(selectedUser ?? null);
              }}
            >
              <option value="" disabled>
                Select a user
              </option>
              {users.map((user) => {
                const customer = customers.filter(
                  (customer) => customer.id === user.id
                );
                if (customer.length === 0) {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  );
                }
              })}
            </select>
            <input type="hidden" name="name" value={selectedUser?.name ?? ""} />
            <UserCircleIcon
              className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 ${
                isDark ? "peer-focus:text-gray-200" : "peer-focus:text-gray-900"
              }`}
            />
          </div>
          <div id="user-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className={`peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 ${bg}`}
                aria-describedby="email-error"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <AtSymbolIcon
                className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 ${
                  isDark
                    ? "peer-focus:text-gray-200"
                    : "peer-focus:text-gray-900"
                }`}
              />
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {state.errors?.email &&
              state.errors.email.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Customer</Button>
      </div>
    </form>
  );
}
