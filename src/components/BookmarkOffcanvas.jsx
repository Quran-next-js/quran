"use client";
import { useState, useEffect } from "react";
import { FiXCircle } from "react-icons/fi";

export default function BookmarkOffcanvas({ isOpen, setIsOpen, currentPageRange }) {
   const [bookmarks, setBookmarks] = useState([]);
   const [customName, setCustomName] = useState("");

   // استرجاع الحفظ عند الفتح
   useEffect(() => {
      if (isOpen) {
         const saved = localStorage.getItem("mushaf_bookmarks");
         if (saved) {
            setBookmarks(JSON.parse(saved));
            console.log("✅ تم تحميل النقاط المحفوظة:", JSON.parse(saved));
         }
      }
   }, [isOpen]);

   const handleSave = () => {
      if (!currentPageRange?.length) return;

      const page = currentPageRange[0].page_number;
      const data = {
         id: Date.now(), // معرف فريد لكل نقطة
         page,
         name: customName || `صفحة ${page}`,
         timestamp: new Date().toISOString(),
      };

      const updated = [...bookmarks, data];
      localStorage.setItem("mushaf_bookmarks", JSON.stringify(updated));
      setBookmarks(updated);
      setCustomName("");

      console.log("💾 تم حفظ نقطة:", data);
   };

   const handleGoToBookmark = (page) => {
      console.log("🚀 الانتقال إلى الصفحة:", page);

      setTimeout(() => {
         const el = document.getElementById(`page-${page}`);
         if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
         } else {
            console.warn("❌ لم يتم العثور على العنصر:", `page-${page}`);
         }
      }, 300);

      setIsOpen(false);
   };

   const handleClear = (id) => {
      const updated = bookmarks.filter((b) => b.id !== id);
      localStorage.setItem("mushaf_bookmarks", JSON.stringify(updated));
      setBookmarks(updated);
      console.log("🗑️ تم حذف نقطة الحفظ:", id);
   };

   return (
      <div
         className={`bg-body-secondary fixed bottom-0 left-0 right-0 offcanvas-custom-bg border-t shadow-lg p-1 z-50 transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
            }`}
      >
         <div className="flex justify-between items-center mb-4 p-2 bg-green-600 text-white">
            <h2 className="text-lg font-semibold">🔖 حفظ الصفحة</h2>
            <button
               onClick={() => setIsOpen(false)}
               className="text-red-600 font-bold py-1 px-2 rounded-full hover:bg-red-600 bg-white"
            >
               <FiXCircle size={24} />
            </button>
         </div>

         <div className="space-y-3 px-3 text-right text-lg">
            <div className="mb-3">
               <label className="block mb-1">اسم اختياري للحفظ:</label>
               <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="مثال: بداية الجزء ٥"
               />
            </div>
            <button
               onClick={handleSave}
               className="w-full bg-green-600 text-white px-4 py-2 rounded"
            >
               ✅ حفظ هذه الصفحة
            </button>

            {bookmarks.length > 0 && (
               <div className="mt-4 border-t pt-4 text-lg space-y-3">
                  {bookmarks.map((b) => (
                     <div
                        key={b.id}
                        className="border rounded p-2 flex justify-between items-center"
                     >
                        <div>
                           <p className="font-bold">{b.name}</p>
                           <p className="text-gray-500 text-xs">📄 صفحة: {b.page}</p>
                        </div>
                        <div className="space-x-2">
                           <button
                              onClick={() => handleGoToBookmark(b.page)}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-sm ms-2"
                           >
                            اذهب
                           </button>
                           <button
                              onClick={() => handleClear(b.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                           >
                              🗑️
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
