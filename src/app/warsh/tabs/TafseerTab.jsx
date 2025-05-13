// src/app/hafs/tabs/TafseerTab.jsx
"use client";
import { useEffect, useState } from "react";

const cache = new Map();

export default function TafseerTab({ selectedVerse }) {
  const [tafseer, setTafseer] = useState(null);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;

    const fetchData = async () => {
      if (cache.has(chapterId)) {
        const data = cache.get(chapterId);
        setTafseer(data.find(item => item.t_verse_number === selectedVerse.verse_number));
      } else {
        const res = await fetch(`/data/moyser_tfseer/${chapterId}.json`, {
          headers: { "Cache-Control": "public, max-age=31536000" },
        });
        const data = await res.json();
        cache.set(chapterId, data);
        setTafseer(data.find(item => item.t_verse_number === selectedVerse.verse_number));
      }
    };

    fetchData();
  }, [selectedVerse]);

  if (!tafseer) {
    return (
      <div className="text-muted text-center p-4 bg-sky-900/5">
        <p> لا توجد بيانات تفسير لهذه الآية..</p>
      </div>
    );
  }

  return (
    <div className="text-end px-0 space-y-0">
      <div className="border border-sky-700 p-4 rounded-lg">
        <h4 className="mb-2 font-bold">التفسير الميسر:</h4>
        <p
          className="leading-loose text-justify"
          dangerouslySetInnerHTML={{ __html: tafseer.tafseer }}
        ></p>
      </div>
    </div>
  );
}
