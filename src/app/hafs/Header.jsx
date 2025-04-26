"use client";
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

   return (
      <header className="h-16 bg-green-800 text-white flex items-center justify-between px-4 sticky top-0 z-10 shadow-md">
         <button
            className="text-white font-semibold text-lg surahName"
            onClick={() => openOffcanvas("suraList")}
         >
            {`سورة ${currentSura}` || "السورة"}
         </button>

         <div>
            <input
               type="number"
               min="1"
               max={totalPages}
               value={currentPage}
               onChange={(e) => scrollToPage(Number(e.target.value))}
               className="form-control text-center"
               style={{ width: 60 }}
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
