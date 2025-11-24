"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useContext } from "react";
import { ThemeContext } from "@/app/ThemeRegistry";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
  { name: "Payment", href: "/dashboard/payment", icon: BanknotesIcon },
];

export default function NavLinks() {
  const pathName = usePathname();
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathName === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 transition-colors",
              {
                // Light mode
                "bg-gray-50 hover:bg-sky-100 text-gray-900 hover:text-blue-600":
                  !isDark && !isActive,
                "bg-sky-100 text-blue-600": !isDark && isActive,
                // Dark mode
                "bg-gray-800 hover:bg-gray-700 text-gray-100 hover:text-white":
                  isDark && !isActive,
                "bg-blue-800 text-white": isDark && isActive,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
