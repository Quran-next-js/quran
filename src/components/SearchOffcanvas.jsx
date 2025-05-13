"use client";
import { useState, useEffect } from "react";
import verseSearchData from "@/data/verse_search.json";

export default function SearchOffcanvas({ isOpen, setIsOpen, scrollToPage, highlightVerse }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // ✅ تفريغ البيانات عند فتح البحث من جديد
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // ✅ فلترة نتائج البحث
  useEffect(() => {
    if (query.length >= 3) {
      const lowerQuery = query.toLowerCase();
      const filtered = verseSearchData.filter((verse) =>
        verse.text_imlaei_simple.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleVerseClick = (verse) => {
    setIsOpen(false);
    scrollToPage(verse.page_number);
    highlightVerse(verse.chapter_id, verse.verse_number);
  };

  const highlightMatch = (text, word) => {
    if (!word) return text;
    const regex = new RegExp(`(${word})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
  };

  return (
    <div className={`offcanvas offcanvas-end ${isOpen ? "show" : ""}`} tabIndex="-1" style={{ visibility: isOpen ? "visible" : "hidden" }}>
      <div className="offcanvas-header bg-green-600">
        <h5 className="offcanvas-title"> البحث في المصحف </h5>
        <button type="button" className="btn-close text-reset" onClick={() => setIsOpen(false)}></button>
      </div>
      <div className="offcanvas-body">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="أدخل كلمة للبحث (3 أحرف على الأقل)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {results.length > 0 ? (
          <ul className="list-group">
            {results.map((verse) => (
              <li
                key={verse.id}
                className="list-group-item list-group-item-action mb-3"
                onClick={() => handleVerseClick(verse)}
                style={{ cursor: "pointer" }}
              >
                <div className="mb-2 text-primary dark:text-sky-900">
                  <strong>{verse.chapter_name} - آية {verse.verse_number}</strong>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(verse.text_imlaei_simple, query),
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          query.length >= 3 && <p>لا توجد نتائج مطابقة.</p>
        )}
      </div>
    </div>
  );
}
