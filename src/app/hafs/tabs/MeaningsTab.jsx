// src/app/hafs/tabs/MeaningsTab.jsx
"use client";
import { useEffect, useState } from "react";

const cache = new Map();

export default function MeaningsTab({ selectedVerse }) {
  const [meanings, setMeanings] = useState([]);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const fetchData = async () => {
      if (cache.has(chapterId)) {
        setMeanings(
          cache.get(chapterId).filter(
            (item) => item.verse_number === selectedVerse.verse_number
          )
        );
      } else {
        const res = await fetch(`/data/meaning_all/${chapterId}.json`, {
          headers: { "Cache-Control": "public, max-age=31536000" },
        });
        const data = await res.json();
        cache.set(chapterId, data);
        setMeanings(
          data.filter((item) => item.verse_number === selectedVerse.verse_number)
        );
      }
    };
    fetchData();
  }, [selectedVerse]);

  if (!meanings.length) {
    return <div className="text-muted text-center p-4 bg-sky-900/5"><p>لا توجد بيانات معاني لهذه الآية..</p></div>;
  }

  return (
    <div className="col-lg-12 mt-3">
      <div className="table-responsive ayah-info">
        <table className="table table-bordered table-striped table-hover table-sm">
          <thead className="table-warning">
            <tr><th>الكلمة</th><th>معناها</th></tr>
          </thead>
          <tbody className="text-center">
            {meanings.map((item, index) => (
              <tr key={index}>
                <td>{item.words}</td>
                <td><span>{item.meaning}</span> <small>{item.surce}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
