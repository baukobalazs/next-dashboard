"use client";

import { ThemeContext } from "@/app/ThemeRegistry";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { bg } from "zod/v4/locales";

const TimeSearch = () => {
  const searchParams = useSearchParams();

  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");
  const router = useRouter();
  const pathname = usePathname();
  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";
  const text = isDark ? "text-gray-300" : "text-gray-700";

  const handleFromChange = useDebouncedCallback((date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("from", new Date().toISOString().split("T")[0]);

    if (date) {
      params.set("from", date);
    } else {
      params.delete("from");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleToChange = useDebouncedCallback((date: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("to", new Date().toISOString().split("T")[0]);

    if (date) {
      params.set("to", date);
    } else {
      params.delete("to");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <div className="">
      <div className="mb-4 mt-4">
        <label
          htmlFor="from"
          className={`mb-2 block text-sm ${text} font-medium`}
        >
          From
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              className={`${bg}`}
              type="date"
              id="from"
              name="from"
              value={from}
              min="2000-01-01"
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setFrom(e.target.value);
                handleFromChange(e.target.value);
              }}
              placeholder={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div id="date-error" aria-live="polite" aria-atomic="true"></div>
      </div>

      <div className="mb-4 mt-4">
        <label
          htmlFor="to"
          className={`mb-2 block text-sm ${text} font-medium`}
        >
          To
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              className={`${bg}`}
              type="date"
              id="to"
              name="to"
              value={to}
              min={from}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setTo(e.target.value);
                handleToChange(e.target.value);
              }}
              placeholder={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div id="date-error" aria-live="polite" aria-atomic="true"></div>
      </div>
    </div>
  );
};

export default TimeSearch;
