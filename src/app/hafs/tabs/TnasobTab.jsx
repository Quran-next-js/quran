"use client";
import { useEffect, useState } from "react";

const cache = new Map();

export default function TnasobTab({ selectedVerse }) {
  const [tnasob, setTnasob] = useState([]);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const fetchData = async () => {
      if (cache.has(chapterId)) {
        setTnasob(
          cache.get(chapterId).filter((item) => item.verse_number === selectedVerse.verse_number)
        );
      } else {
        const res = await fetch(`/data/tnasob/${chapterId}.json`, {
          headers: { "Cache-Control": "public, max-age=31536000" },
        });
        const data = await res.json();
        cache.set(chapterId, data);
        setTnasob(data.filter((item) => item.verse_number === selectedVerse.verse_number));
      }
    };
    fetchData();
  }, [selectedVerse]);

  if (!tnasob.length) {
    return <div className="text-muted text-center p-4 bg-sky-900/5"><p>لا توجد بيانات ربط وتناسب لهذه الآية..</p></div>;
  }

  return (
    <div className="text-dark text-end px-0 space-y-0">
      {tnasob.map((item, index) => (
        <div key={index} className="border border-amber-500 p-4 rounded-lg bg-amber-900/5">
          <h4 className="mb-2 font-bold"><span className="badge bg-secondary">مناسبة الآية لما قبلها</span></h4>
          <p className="leading-loose text-justify">{item.content}</p>
          <h4 className="text-center py-3 ayah">
            <span className="qous">﴿</span>{item.text_uthmani}<span className="qous">﴾</span>
          </h4>
        </div>
      ))}
    </div>
  );
}
