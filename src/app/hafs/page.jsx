"use client";

// استدعاء الحزم
import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import pageData from "@/data/page_info.json"; // بيانات السور والأجزاء
import versesJson from "@/data/verses.json"; // بيانات الآيات وإحداثياتها
import Header from "./Header";
import Footer from "./Footer";

// استدعاء المكونات بطريقة dynamic لتقليل حجم الباندل
// const Header = dynamic(() => import('./Header'), { ssr: false, loading: () => <div className="h-16 md:h-20 bg-gray-200 animate-pulse" /> });
// const Footer = dynamic(() => import('./Footer'), { ssr: false, loading: () => <div className="h-12 md:h-16 bg-gray-200 animate-pulse" /> });
const SuraOffcanvas = dynamic(() => import('./SuraOffcanvas'), { ssr: false });
const JuzOffcanvas = dynamic(() => import('./JuzOffcanvas'), { ssr: false });
const VerseOffcanvas = dynamic(() => import('./VerseOffcanvas'), { ssr: false });

export default function HafsPage() {
  // المتغيرات والحالات
  const totalPages = 604;
  const imageWidth = 1446;
  const imageHeight = 2297;
  const scrollContainerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSura, setCurrentSura] = useState("");
  const [currentJuz, setCurrentJuz] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const flipAudioRef = useRef(null); // مرجع لصوت التقليب

  // تحميل مكتبة Bootstrap JS عند أول تحميل
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
      console.error("فشل تحميل Bootstrap:", err)
    );
  }, []);

  // تفعيل أول تفاعل مع الصفحة بطريقة مبسطة
  useEffect(() => {
    const handleFirstInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
    document.addEventListener("pointerdown", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);
    return () => {
      document.removeEventListener("pointerdown", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  // تحضير صوت التقليب مرة واحدة
  useEffect(() => {
    flipAudioRef.current = new Audio("/sounds/page-flip.mp3");
  }, []);

  // إنشاء خريطة السور والأجزاء
  const suraMap = {};
  const juzMap = {};
  for (let entry of pageData) {
    if (!suraMap[entry.sura]) suraMap[entry.sura] = entry.page;
    if (!juzMap[entry.juz]) juzMap[entry.juz] = entry.page;
  }
  const suraNames = Object.keys(suraMap);
  const juzNumbers = Object.keys(juzMap);

  // التعامل مع السكرول وتحديث المعلومات
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const pageWidth = container.clientWidth;
    const newPage = Math.round(scrollLeft / pageWidth) + 1;
    setCurrentPage(newPage);
    const info = pageData.find((p) => p.page === newPage);
    if (info) {
      setCurrentSura(info.sura);
      setCurrentJuz(info.juz);
    }
    localStorage.setItem("lastVisitedPage", newPage);
  };

  // الانتقال لصفحة مع صوت تقليب
  const scrollToPage = (page) => {
    const container = scrollContainerRef.current;
    const pageWidth = container.clientWidth;
    container.scrollTo({
      left: (page - 1) * pageWidth,
      behavior: "smooth",
    });
    if (userInteracted && flipAudioRef.current) {
      flipAudioRef.current.play().catch(() => { });
    }
  };

  // التعامل مع أول تحميل للصفحة
  useEffect(() => {
    const savedPage = parseInt(localStorage.getItem("lastVisitedPage"), 10);
    if (savedPage && !isNaN(savedPage)) {
      setCurrentPage(savedPage);
      setTimeout(() => {
        scrollToPage(savedPage);
      }, 100);
    } else {
      handleScroll();
    }
  }, []);

  // تسريع استخراج آيات الصفحة
  const versesByPage = useMemo(() => {
    const map = {};
    for (const verse of versesJson) {
      if (!map[verse.page_number]) {
        map[verse.page_number] = [];
      }
      map[verse.page_number].push(verse);
    }
    return map;
  }, []);

  const currentPageRange = versesByPage[currentPage] || [];

  // تظليل آية
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
      {/* الهيدر */}
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
          const versesOnPage = versesByPage[page] || [];

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

              {/* تظليل الآيات */}
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
                    <g key={verse.id}
                      id={`ayah-${verse.chapter_id}-${verse.verse_number}`} // ✅ إضافة id هنا للتظليل والاسكرول
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

      {/* الفوتر */}
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
        versesData={versesJson}
      />
    </div>
  );
}
