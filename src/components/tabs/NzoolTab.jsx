"use client";
import { useEffect, useState } from "react";

const cache = new Map();

export default function NzoolTab({ selectedVerse }) {
  const [nzool, setNzool] = useState(null);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const fetchData = async () => {
      if (cache.has(chapterId)) {
        const data = cache.get(chapterId);
        setNzool(data.find((item) => item.verse_number === selectedVerse.verse_number));
      } else {
        const res = await fetch(`/data/nzools/${chapterId}.json`, {
          headers: { "Cache-Control": "public, max-age=31536000" },
        });
        const data = await res.json();
        cache.set(chapterId, data);
        setNzool(data.find((item) => item.verse_number === selectedVerse.verse_number));
      }
    };
    fetchData();
  }, [selectedVerse]);

  if (!nzool || nzool.reason === " لم نقف على شيء") {
    return <div className="text-muted text-center p-4 bg-sky-900/5"><p>لا توجد بيانات أسباب نزول لهذه الآية..</p></div>;
  }

  return (
    <div className="text-end px-0 space-y-0">
      <div className="border border-sky-700 p-4 rounded-lg">
        <p className="leading-loose text-justify">
          {nzool.reason}
          {nzool.source && nzool.source !== "____" && (
            <span className="text-sm text-gray-400 text-start mt-3 d-block">المصدر: {nzool.source}</span>
          )}
        </p>
      </div>
    </div>
  );
}
