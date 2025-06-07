"use client";
import { useEffect, useState, useRef } from "react";

export default function GrammarTab({ selectedVerse }) {
  const [grammarItems, setGrammarItems] = useState([]);
  const cacheRef = useRef({}); // كاش داخل الجلسة

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const verseNumber = selectedVerse.verse_number;

    if (cacheRef.current[chapterId]) {
      const cachedData = cacheRef.current[chapterId];
      const filtered = cachedData.filter(
        (item) => item.verse_number === verseNumber
      );
      setGrammarItems(filtered);
    } else {
      fetch(`/data/grammer/${chapterId}.json`)
        .then((res) => res.json())
        .then((data) => {
          cacheRef.current[chapterId] = data;
          const filtered = data.filter(
            (item) => item.verse_number === verseNumber
          );
          setGrammarItems(filtered);
        })
        .catch((err) => {
          console.error("❌ خطأ في تحميل الإعراب:", err);
          setGrammarItems([]);
        });
    }
  }, [selectedVerse]);

  if (!selectedVerse) return null;

  if (grammarItems.length === 0) {
    return (
      <div className="text-muted text-center p-4 bg-sky-900/5">
        <p> لا توجد بيانات إعراب لهذه الآية..</p>
      </div>
    );
  }

  return (
    <div className="text-end px-0 space-y-0">
      <div className="border border-sky-700 p-2 rounded-lg">
        {grammarItems.map((item, index) => (
          <div
            key={index}
            className="border border-sky-700 p-2 mb-2 rounded-lg "
          >
            <p className="leading-loose text-justify">
              <span className="badge bg-secondary ms-3"> {item.words} </span>
              {item.grammar}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
