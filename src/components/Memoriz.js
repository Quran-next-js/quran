"use client";

import { useEffect, useState } from "react";

export default function Memoriz({ isOpen, setIsOpen, currentPage, goToPage, isMemorizationMode, setIsMemorizationMode }) {
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const num = Number(currentPage);
    if (isOpen && !isNaN(num)) {
      const validPage = Math.max(1, Math.min(num, 604));
      setPageNumber(validPage);
    }
  }, [isOpen, currentPage]);

  const handlePageChange = (e) => {
    let newPage = parseInt(e.target.value, 10);
    if (isNaN(newPage)) newPage = 1;
    newPage = Math.min(604, Math.max(1, newPage));
    setPageNumber(newPage);
  };


  const handleToggleMemorization = () => {
   const newMode = !isMemorizationMode;
   console.log("Toggle Memorization Mode:", newMode);
   setIsMemorizationMode(newMode);
   
   // الانتقال للصفحة المحددة فقط عند تفعيل الوضع
   if (newMode) {
     goToPage(pageNumber);
   } else {
     // إلغاء التظليل عند إيقاف الوضع
     setPageNumber(currentPage); // إعادة تعيين إلى الصفحة الحالية
     goToPage(currentPage); // إعادة تحميل الصفحة الحالية
   }
 };

  return (
    <div className="p-1 text-right mb-3 mt-2 shadow-md border border-gray-600 rounded-lg">
      <div className="d-flex justify-between align-items-center">
        <h4 htmlFor="pageSelect" className="text-lg">
           صفحة التسميع:
        </h4>
        <input
          type="number"
          id="pageSelect"
          min="1"
          max="604"
          value={isNaN(pageNumber) ? '' : pageNumber}
          onChange={handlePageChange}
          className="border px-2 py-1 rounded w-24"
        />
      

      <button
        onClick={handleToggleMemorization}
        className={`px-2 py-2 rounded text-white ${isMemorizationMode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-500 hover:bg-green-600'}`}
      >
        {isMemorizationMode ? "إيقاف التسميع" : "ابدأ التسميع"}
      </button>
      </div>
    </div>
  );
}
