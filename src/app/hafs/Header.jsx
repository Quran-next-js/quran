"use client";
import { useState, useEffect } from "react";
import { isAnyOffcanvasOpen } from "@/utils/offcanvasUtils";

export default function Header({ currentSura, currentJuz, currentPage, totalPages, scrollToPage }) {

   const arabicOrdinals = [
      "الأول", "الثاني", "الثالث", "الرابع", "الخامس",
      "السادس", "السابع", "الثامن", "التاسع", "العاشر",
      "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر",
      "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
      "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون",
      "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون"
   ];

   const getArabicOrdinal = (num) => arabicOrdinals[num - 1] || num;

   const openOffcanvas = async (id) => {
      if (isAnyOffcanvasOpen()) return; // ← منع الفتح لو في واحد شغال

      const { Offcanvas } = await import("bootstrap");
      const el = document.getElementById(id);
      if (el) {
         const offcanvas = new Offcanvas(el);
         offcanvas.show();
      }
   };

   const [inputValue, setInputValue] = useState(currentPage);
   const [shake, setShake] = useState(false);

   useEffect(() => {
      setInputValue(currentPage);
   }, [currentPage]);

   let debounceTimer;
   const handleChange = (e) => {
      const value = e.target.value.replace(/\D/g, ""); // يمنع أي حروف
      setInputValue(value);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         attemptScroll(value);
      }, 600);
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         attemptScroll(inputValue);
      }
   };

   const handleBlur = () => {
      attemptScroll(inputValue);
   };

   const attemptScroll = (value) => {
      const page = Number(value);
      if (page >= 1 && page <= totalPages) {
         scrollToPage(page);
      } else {
         triggerShake();
      }
   };

   const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
   };


   return (
      <header className="h-16 bg-green-800 text-white flex items-center justify-between px-4 sticky top-0 z-10 shadow-md">
         <button
            className="text-white font-semibold text-lg surahName"
            onClick={() => openOffcanvas("suraList")}
         >
            {`سورة ${currentSura}`}
         </button>

         <div className="relative">
            <input
               type="text"
               inputMode="numeric"
               value={inputValue}
               onChange={handleChange}
               onFocus={(e) => e.target.select()} // ← هنا أضفنا السطر الجميل
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
               className={`text-center font-bold border-2 rounded-xl w-20 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${shake ? "animate-shake border-red-500" : "border-green-700"
                  }`}
               style={{
                  fontFamily: "Cairo, 'Amiri', serif",
                  backgroundColor: "#f9f9f9",
                  color: "#1b4332",
               }}
               aria-label="رقم الصفحة"
            />
         </div>

         <button
            className="text-white font-semibold text-lg juzName"
            onClick={() => openOffcanvas("juzList")}
         >
            {`الجزء ${getArabicOrdinal(Number(currentJuz))}`}
         </button>
      </header>
   );
}
