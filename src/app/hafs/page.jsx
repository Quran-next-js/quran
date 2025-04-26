"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import pageData from "@/data/page_info.json";
import versesJson from "@/data/verses.json";
import SuraOffcanvas from "./SuraOffcanvas";
import JuzOffcanvas from "./JuzOffcanvas";
import VerseOffcanvas from "./VerseOffcanvas";
import Header from "./Header";
import Footer from "./Footer";

export default function HafsPage() {
  const totalPages = 604; // عدد صفحات المصحف
  const scrollContainerRef = useRef(null); // مرجع لمربع السكرول الأفقي
  const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
  const [currentSura, setCurrentSura] = useState(""); // اسم السورة الحالية
  const [currentJuz, setCurrentJuz] = useState(1); // رقم الجزء الحالي
  const [selectedVerse, setSelectedVerse] = useState(null); // الآية المحددة
  const [highlightedVerseId, setHighlightedVerseId] = useState(null); // ID الآية المظللة
  const [userInteracted, setUserInteracted] = useState(false); // هل المستخدم تفاعل مع الصفحة؟

  const imageWidth = 1446; // عرض صورة الصفحة
  const imageHeight = 2297; // ارتفاع صورة الصفحة

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
      console.error("فشل تحميل Bootstrap:", err)
    );
  }, []);

  // إنشاء خريطة لربط السور والأجزاء بالصفحات
  const suraMap = {};
  const juzMap = {};
  for (let entry of pageData) {
    if (!suraMap[entry.sura]) suraMap[entry.sura] = entry.page;
    if (!juzMap[entry.juz]) juzMap[entry.juz] = entry.page;
  }
  const suraNames = Object.keys(suraMap);
  const juzNumbers = Object.keys(juzMap);

  // دالة تتبع السكرول لتحديث الصفحة والسورة والجزء الحالي
  const handleScroll = () => {
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const pageWidth = scrollContainerRef.current.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth) + 1;
    setCurrentPage(newPage);

    const info = pageData.find((p) => p.page === newPage);
    if (info) {
      setCurrentSura(info.sura);
      setCurrentJuz(info.juz);
    }

    // حفظ آخر صفحة في localStorage
    localStorage.setItem("lastVisitedPage", newPage);
  };

  // دالة للانتقال إلى صفحة معينة مع صوت التقليب
  const scrollToPage = (page) => {
    const container = scrollContainerRef.current;
    const pageWidth = container.clientWidth;
    container.scrollTo({
      left: (page - 1) * pageWidth,
      behavior: "smooth",
    });
    playFlipSound();
  };

  // دالة لتشغيل صوت تقليب الصفحة
  const playFlipSound = () => {
    if (!userInteracted) return; // تأكد أن المستخدم تفاعل قبل تشغيل الصوت

    const audio = new Audio("/sounds/page-flip.mp3");
    audio.play().catch((err) => {
      // تجاهل الخطأ بدون طباعة في الكونسول
    });
  };

  // عند أول تحميل للصفحة
  useEffect(() => {
    // استرجاع آخر صفحة من localStorage لو موجودة
    const savedPage = parseInt(localStorage.getItem("lastVisitedPage"), 10);
    if (savedPage && !isNaN(savedPage)) {
      setCurrentPage(savedPage);
      setTimeout(() => {
        scrollToPage(savedPage);
      }, 100);
    } else {
      handleScroll(); // لو مفيش صفحة محفوظة، تحديث الوضع الحالي
    }

    // أول تفاعل مع الصفحة نعتبره userInteracted
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("scroll", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };
  }, []);

  const currentPageRange = versesJson.filter(
    (v) => v.page_number === currentPage
  );

  // دالة لتظليل آية محددة
  const highlightVerse = (chapter_id, verse_number) => {
    const verse = versesJson.find(
      (v) => v.chapter_id === chapter_id && v.verse_number === verse_number
    );
    if (verse) {
      setHighlightedVerseId(verse.id);
    }
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex-none h-16 md:h-20">
        <Header
          currentSura={currentSura}
          currentJuz={currentJuz}
          currentPage={currentPage}
          totalPages={totalPages}
          scrollToPage={scrollToPage}
        />
      </div>

      {/* منطقة الصفحات القابلة للتمرير */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto scroll-smooth snap-x snap-mandatory flex flex-row-reverse"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          direction: "rtl",
          transform: "scaleX(-1)",
        }}
      >
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          const versesOnPage = versesJson.filter((v) => v.page_number === page);

          return (
            <div
              key={page}
              className="relative flex-shrink-0 w-full h-full snap-start bg-gray-100"
              style={{
                minWidth: "100vw",
                height: "100%",
                transform: "scaleX(-1)",
              }}
            >
              {/* صورة الصفحة */}
              <Image
                src={`https://ik.imagekit.io/hefz/quran/${page}.webp`}
                id={`page-${page}`}
                alt={`صفحة ${page}`}
                width={imageWidth}
                height={imageHeight}
                className="absolute top-0 left-0 w-full h-full object-contain z-0"
                loading={page === currentPage ? "eager" : "lazy"}
                priority={page === currentPage}
              />

              {/* تظليل الآيات باستخدام SVG */}
              <svg
                className="absolute top-0 left-0 w-full h-full z-10"
                viewBox={`0 0 ${imageWidth} ${imageHeight}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                {versesOnPage.map((verse) => {
                  const coordsArray = verse.img_coords
                    .split(",")
                    .map((n) => parseInt(n.trim(), 10))
                    .filter((n) => !isNaN(n));

                  if (coordsArray.length % 2 !== 0) return null;

                  const points = [];
                  for (let i = 0; i < coordsArray.length; i += 2) {
                    points.push(`${coordsArray[i]},${coordsArray[i + 1]}`);
                  }

                  const isSelected = verse.id === highlightedVerseId;

                  return (
                    <g
                      key={verse.id}
                      id={`ayah-${verse.chapter_id}-${verse.verse_number}`}
                    >
                      <polygon
                        points={points.join(" ")}
                        fill={isSelected ? "rgba(0, 123, 255, 0.2)" : "transparent"}
                        stroke={isSelected ? "#007bff" : "transparent"}
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setSelectedVerse(verse);
                          setHighlightedVerseId(verse.id);
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          );
        })}
      </div>

      {/* تذييل الصفحة */}
      <div className="flex-none h-12 md:h-16">
        <Footer currentPageRange={currentPageRange} highlightVerse={highlightVerse} />
      </div>

      {/* النوافذ الجانبية */}
      <SuraOffcanvas
        suraNames={suraNames}
        suraMap={suraMap}
        scrollToPage={scrollToPage}
      />

      <JuzOffcanvas
        juzNumbers={juzNumbers}
        juzMap={juzMap}
        scrollToPage={scrollToPage}
      />

      <VerseOffcanvas
        selectedVerse={selectedVerse}
        setSelectedVerse={(verse) => {
          setSelectedVerse(verse);
          setHighlightedVerseId(verse?.id ?? null);
        }}
        scrollToPage={scrollToPage}
      />
    </div>
  );
}
