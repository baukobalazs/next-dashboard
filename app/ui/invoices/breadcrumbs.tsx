"use client";
import { clsx } from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import { ThemeContext } from "@/app/ThemeRegistry";
import { useContext } from "react";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const textSubtle = isDark ? "text-gray-400" : "text-gray-500";
  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className={clsx(lusitana.className, "flex text-xl md:text-2xl")}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            aria-current={breadcrumb.active}
            className={clsx(breadcrumb.active && textSubtle)}
          >
            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
            {index < breadcrumbs.length - 1 ? (
              <span className="mx-3 inline-block">/</span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
