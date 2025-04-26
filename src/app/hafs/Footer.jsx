"use client";
import { useState } from "react";
import { FiSettings, FiHeadphones, FiBookmark } from "react-icons/fi";
import ListenOffcanvas from "./ListenOffcanvas";
import BookmarkOffcanvas from "./BookmarkOffcanvas";
import SettingOffcanvas from "./SettingOffcanvas"; // ✅ إضافة الاستيراد

export default function Footer({ currentPageRange, highlightVerse }) {
  const [showListen, setShowListen] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [showSettings, setShowSettings] = useState(false); // ✅ حالة جديدة للإعدادات

  return (
    <>
      <footer className="h-16 bg-green-800 text-white -around sticky bottom-0 z-10 shadow-md">
        <div className="flex items-center justify-around p-2">
        <button title="الإعدادات" onClick={() => setShowSettings(true)}>
          <FiSettings size={30} />
        </button>

        <button title="استماع" onClick={() => setShowListen(true)}>
          <FiHeadphones size={30} />
        </button>

        <button title="حفظ الصفحة" onClick={() => setShowBookmark(true)}>
          <FiBookmark size={30} />
        </button>
        </div>
      </footer>

      <ListenOffcanvas
        isOpen={showListen}
        setShowListen={setShowListen}
        currentPageRange={currentPageRange}
        highlightVerse={highlightVerse}
      />

      <BookmarkOffcanvas
        isOpen={showBookmark}
        setIsOpen={setShowBookmark}
        currentPageRange={currentPageRange}
      />

      <SettingOffcanvas
        isOpen={showSettings}
        setIsOpen={setShowSettings}
      />
    </>
  );
}
