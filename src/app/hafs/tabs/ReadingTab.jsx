"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const cache = new Map();
const H5AudioPlayer = dynamic(() => import("react-h5-audio-player"), { ssr: false });
import "react-h5-audio-player/lib/styles.css";

export default function ReadingTab({ selectedVerse }) {
  const [reading, setReading] = useState(null);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const fetchData = async () => {
      if (cache.has(chapterId)) {
        const data = cache.get(chapterId);
        setReading(data.find((item) => item.verse_number === selectedVerse.verse_number));
      } else {
        const res = await fetch(`/data/reading/${chapterId}.json`, {
          headers: { "Cache-Control": "public, max-age=31536000" },
        });
        const data = await res.json();
        cache.set(chapterId, data);
        setReading(data.find((item) => item.verse_number === selectedVerse.verse_number));
      }
    };
    fetchData();
  }, [selectedVerse]);

  if (!reading) {
    return <div className="text-muted text-center p-4 bg-sky-900/5"><p>لا توجد بيانات قراءات لهذه الآية..</p></div>;
  }

  return (
    <div className="text-black text-end px-0 space-y-0">
      {reading.sound_link && (
        <div className="border border-sky-700 p-4 rounded-lg bg-sky-900/5">
          <H5AudioPlayer
            src={`/audio/qraat/${reading.sound_link}.mp3`}
            autoPlay={false}
            controls
            className="mt-2 rounded"
            style={{ direction: "ltr" }}
          />
        </div>
      )}
      {reading.reading && (
        <div className="border border-sky-700 p-4 rounded-lg bg-sky-900/5">
          <p dangerouslySetInnerHTML={{ __html: reading.reading }} />
        </div>
      )}
    </div>
  );
}
