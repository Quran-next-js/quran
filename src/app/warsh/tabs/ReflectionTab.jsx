"use client";
import { useEffect, useState, useRef } from "react";

export default function ReflectionTab({ selectedVerse }) {
  const [reflections, setReflections] = useState([]);
  const cacheRef = useRef({}); // كاش داخل الجلسة

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const verseNumber = selectedVerse.verse_number;

    // لو الملف اتحمل قبل كده، استخدمه من الكاش
    if (cacheRef.current[chapterId]) {
      const cachedData = cacheRef.current[chapterId];
      const filtered = cachedData.filter(
        (item) =>
          item.verse_number === verseNumber
      );
      setReflections(filtered);
    } else {
      // وإلا، حمّل الملف واحفظه في الكاش
      fetch(`/data/reflections/${chapterId}.json`)
        .then((res) => res.json())
        .then((data) => {
          cacheRef.current[chapterId] = data; // كاش الملف
          const filtered = data.filter(
            (item) =>
              item.verse_number === verseNumber
          );
          setReflections(filtered);
        })
        .catch((err) => {
          console.error("❌ خطأ في تحميل الوقفات:", err);
          setReflections([]);
        });
    }
  }, [selectedVerse]);

  if (!selectedVerse) return null;

  if (reflections.length === 0) {
    return (
      <div className="text-muted text-center p-4 bg-sky-900/5">
        <p>لا توجد بيانات وقفات تدبرية لهذه الآية.</p>
      </div>
    );
  }

  const typeStyles = {
    "وقفة": "bg-blue-100 border-blue-600 text-blue-900",
    "عمل": "bg-green-100 border-green-600 text-green-900",
    "بلاغة": "bg-yellow-100 border-yellow-600 text-yellow-900",
    "تفاعل": "bg-purple-100 border-purple-600 text-purple-900",
    "إسقاط": "bg-red-100 border-red-600 text-red-900",
  };

  return (
    <div className="p-0 bg-sky-900/5 text-end space-y-2 rounded-lg">
      {reflections.map((item, index) => {
        const content = item.reflection.replace(/^[\u200E\u200F\u00A0]+/, '').trim();
        const style = typeStyles[item.type] || "bg-gray-100 border-gray-400 text-gray-800";
        return (
          <div
            key={index}
            className={`border p-2 mb-2 rounded-lg ${style}`}
          >
            <p className="leading-loose text-justify">
              <span className="badge bg-secondary ms-3"> {item.type} </span>
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
}
