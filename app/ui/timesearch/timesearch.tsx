"use client";

import { ThemeContext } from "@/app/ThemeRegistry";
import React, { useContext, useState } from "react";
import { bg } from "zod/v4/locales";

const TimeSearch = () => {
  const [from, setFrom] = useState(new Date().toISOString().split("T")[0]);
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);

  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";
  const bg = isDark ? "bg-gray-900" : "bg-white";
  return (
    <div className="">
      <div className="mb-4 mt-4">
        <label htmlFor="deadline" className="mb-2 block text-sm font-medium">
          From
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              className={`${bg}`}
              type="date"
              id="deadline"
              name="deadline"
              value={from}
              min={new Date().toISOString().split("T")[0]}
              max="2030-12-31"
              onChange={(e) => {
                setFrom(e.target.value);
              }}
              placeholder={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div id="date-error" aria-live="polite" aria-atomic="true"></div>
      </div>

      <div className="mb-4 mt-4">
        <label htmlFor="deadline" className="mb-2 block text-sm font-medium">
          To
        </label>
        <div className="relative mt-2 rounded-md">
          <div className="relative">
            <input
              className={`${bg}`}
              type="date"
              id="deadline"
              name="deadline"
              value={to}
              min={new Date().toISOString().split("T")[0]}
              max="2030-12-31"
              onChange={(e) => {
                setTo(e.target.value);
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
