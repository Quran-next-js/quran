"use client";
import { useState } from "react";
import Image from "next/image";
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
            <Image
              src="/images/logo/gear.webp"
              alt="اعدادت الحفظ الميسر"
              width={30}
              height={30}
              className="w-full h-full z-0"
              loading= "lazy"
            />
          </button>

          <button title="استماع" onClick={() => setShowListen(true)}>
          <Image
              src="/images/logo/volume.webp"
              alt="استماع الحفظ الميسر"
              width="30"
              height="30"
              className="w-full h-full z-0"
              loading= "lazy"
            />
          </button>

          <button title="حفظ الصفحة" onClick={() => setShowBookmark(true)}>
          <Image
              src="/images/logo/bookmark.webp"
              alt="حفظ الصفحة الحفظ الميسر"
              width="30"
              height="30"
              className="w-full h-full z-0"
              loading= "lazy"
            />
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
