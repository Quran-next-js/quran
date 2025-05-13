"use client";
import { useEffect, useState } from "react";
import { FiXCircle } from "react-icons/fi";
import reciters from "@/data/reciters.json";
import verses from "@/data/verses.json";
import surahs from "@/data/surahs.json";

export default function ListenOffcanvas({
  isOpen,
  currentPageRange,
  setShowListen,
  highlightVerse,
}) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [reciter, setReciter] = useState(reciters[0]);
  const [repeat, setRepeat] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);

  const zeroPad = (num) => String(num).padStart(3, "0");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudio(new Audio());
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFrom(null);
      setTo(null);
      highlightVerse(null, null); // ⛔ إزالة التظليل عند إغلاق الواجهة
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      currentPageRange?.length &&
      isOpen &&
      from === null &&
      to === null
    ) {
      const pageNumber = currentPageRange[0]?.page_number;
      if (!pageNumber) return;

      const versesInPage = verses.filter((v) => v.page_number === pageNumber);
      if (versesInPage.length) {
        setFrom({
          chapter_id: versesInPage[0].chapter_id,
          verse_number: versesInPage[0].verse_number,
        });
        setTo({
          chapter_id: versesInPage[versesInPage.length - 1].chapter_id,
          verse_number: versesInPage[versesInPage.length - 1].verse_number,
        });

        console.log("📌 Auto range set from page:", pageNumber);
      }
    }
  }, [currentPageRange, isOpen]);

  useEffect(() => {
    if (from && to && repeat) {
      const fromIndex = verses.findIndex(
        (v) =>
          v.chapter_id === from.chapter_id &&
          v.verse_number === from.verse_number
      );
      const toIndex = verses.findIndex(
        (v) =>
          v.chapter_id === to.chapter_id &&
          v.verse_number === to.verse_number
      );

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex <= toIndex) {
        const range = verses.slice(fromIndex, toIndex + 1);
        const list = [];
        for (let i = 0; i < repeat; i++) {
          list.push(...range);
        }
        setPlaylist(list);
        setCurrentIndex(0);
        console.log("✅ Playlist updated", list);
      }
    }
  }, [from, to, repeat]);

  const scrollToAyah = (chapter_id, verse_number) => {
    const el = document.getElementById(`ayah-${chapter_id}-${verse_number}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("📜 Scrolled to", `ayah-${chapter_id}-${verse_number}`);
    }
  };

  const playCurrent = () => {
    const verse = playlist[currentIndex];
    if (!verse || !audio) return;

    const surah = zeroPad(verse.chapter_id);
    const ayah = zeroPad(verse.verse_number);
    const url = `${reciter.server}${surah}${ayah}.mp3`;

    audio.src = url;
    audio.playbackRate = speed;

    audio.play()
      .then(() => {
        console.log("▶️ Playing", url);
        scrollToAyah(verse.chapter_id, verse.verse_number);
        highlightVerse(verse.chapter_id, verse.verse_number); // ✅ التظليل
      })
      .catch((err) => {
        console.warn("⛔️ Play error", err);
      });
  };

  const handlePlay = () => {
    if (!playlist.length || !audio) return;
    setIsPlaying(true);
    setShowListen(false); // ✅ إغلاق الواجهة
    playCurrent();
  };

  const handleStop = () => {
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    highlightVerse(null, null); // ✅ إزالة التظليل
    console.log("⏹️ Stopped");
  };

  useEffect(() => {
    if (!audio) return;
    audio.onended = () => {
      const next = currentIndex + 1;
      if (next < playlist.length) {
        setCurrentIndex(next);
      } else {
        handleStop();
      }
    };
  }, [audio, currentIndex, playlist]);

  useEffect(() => {
    if (isPlaying) {
      playCurrent();
    }
  }, [currentIndex]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t shadow-lg p-1 z-50 transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
        } 
  bg-body-secondary 
  border-body-tertiary 
  text-body-emphasis`}
    >
      <div className="flex justify-between items-center mb-4 p-2 bg-green-600 text-white">
        <h5 className="text-lg font-semibold">🎧 الاستماع </h5>
        <button
          onClick={() => setShowListen(false)}
          className="text-red-600 font-bold py-1 px-2 rounded-full hover:bg-red-600 bg-white"
        >
          <FiXCircle size={24} />
        </button>
      </div>

      <div className="space-y-3 text-right text-lg px-4">
        <div className="flex justify-between items-center mb-3">
          <label className="block mb-1">من الآية:</label>
          <select
            disabled={isPlaying}
            value={from ? `${from.chapter_id}-${from.verse_number}` : ""}
            onChange={(e) => {
              const [chapter_id, verse_number] = e.target.value
                .split("-")
                .map(Number);
              setFrom({ chapter_id, verse_number });
            }}
            className="w-70 p-2 border rounded"
          >
            {verses.map((v) => (
              <option key={v.id} value={`${v.chapter_id}-${v.verse_number}`}>
                {surahs.find((s) => s.id === v.chapter_id)?.name} - {v.verse_number}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-3">
          <label className="block mb-1">إلى الآية:</label>
          <select
            disabled={isPlaying}
            value={to ? `${to.chapter_id}-${to.verse_number}` : ""}
            onChange={(e) => {
              const [chapter_id, verse_number] = e.target.value
                .split("-")
                .map(Number);
              setTo({ chapter_id, verse_number });
            }}
            className="w-70 p-2 border rounded"
          >
            {verses.map((v) => (
              <option key={v.id} value={`${v.chapter_id}-${v.verse_number}`}>
                {surahs.find((s) => s.id === v.chapter_id)?.name} - {v.verse_number}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center mb-3">
          <label className="block mb-1">القارئ:</label>
          <select
            disabled={isPlaying}
            value={reciter.id}
            onChange={(e) => {
              const selected = reciters.find((r) => r.id === e.target.value);
              setReciter(selected);
            }}
            className="w-70 p-2 border rounded"
          >
            {reciters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label className="block mb-1">التكرار:</label>
          <input
            disabled={isPlaying}
            type="range"
            min="1"
            max="10"
            step="1"
            value={repeat}
            onChange={(e) => setRepeat(parseInt(e.target.value))}
            className="w-full appearance-none bg-green-200 h-2 rounded"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />
          <div className="text-center text-lg font-semibold mt-2">{repeat}</div>
        </div>

        <div className="mt-4">
          <label className="block mb-1">السرعة:</label>
          <input
            disabled={isPlaying}
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full appearance-none bg-blue-200 h-2 rounded"
            style={{
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />
          <div className="text-center text-lg font-semibold mt-2">{speed}x</div>
        </div>

      </div>

      <div className="mt-4 mb-3 flex justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ▶️ بدء التشغيل
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            ⏹️ إيقاف التشغيل
          </button>
        )}
      </div>
    </div>
  );
}
