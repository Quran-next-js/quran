"use client";

import { useEffect, useState } from "react";

export default function DarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // تحميل الوضع الداكن من localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
      setIsDarkMode(false);
    }
  }, []);
  // تغيير الوضع الداكن وتخزينه
  const toggleDarkMode = (enabled) => {
    setIsDarkMode(enabled);
    const theme = enabled ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <div className="p-1 text-right mb-3 mt-2 shadow-md border border-gray-600 rounded-lg">
      <div className="form-check form-switch d-flex justify-between align-items-center">
        <h4 className="form-check-label ms-3 text-2xl">الوضع الداكن :</h4>
        <input
          className="form-check-input"
          style={{ height: "1.5em", width: "3.5em" }}
          type="checkbox"
          id="darkModeSwitch"
          onChange={(e) => toggleDarkMode(e.target.checked)}
          checked={isDarkMode}
        />
      </div>
    </div>
  );
}
