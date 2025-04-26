// hafs/page.jsx
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
  const totalPages = 604;
  const scrollContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSura, setCurrentSura] = useState("");
  const [currentJuz, setCurrentJuz] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [highlightedVerseId, setHighlightedVerseId] = useState(null);

  const imageWidth = 1446;
  const imageHeight = 2297;

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((err) =>
      console.error("فشل تحميل Bootstrap:", err)
    );
  }, []);

  const suraMap = {};
  const juzMap = {};
  for (let entry of pageData) {
    if (!suraMap[entry.sura]) suraMap[entry.sura] = entry.page;
    if (!juzMap[entry.juz]) juzMap[entry.juz] = entry.page;
  }
  const suraNames = Object.keys(suraMap);
  const juzNumbers = Object.keys(juzMap);

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
  };

  const scrollToPage = (page) => {
    const container = scrollContainerRef.current;
    const pageWidth = container.clientWidth;
    container.scrollTo({
      left: (page - 1) * pageWidth,
      behavior: "smooth",
    });
    playFlipSound();
  };

  const playFlipSound = () => {
    const audio = new Audio("/sounds/page-flip.mp3");
    audio.play().catch((err) => console.error("خطأ في تشغيل الصوت:", err));
  };

  useEffect(() => {
    handleScroll();
  }, []);


  const currentPageRange = versesJson.filter(
    (v) => v.page_number === currentPage
  );

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
      <div className="flex-none h-16 md:h-20">
        <Header
          currentSura={currentSura}
          currentJuz={currentJuz}
          currentPage={currentPage}
          totalPages={totalPages}
          scrollToPage={scrollToPage}
        />
      </div>

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
          const versesOnPage = versesJson.filter(
            (v) => v.page_number === page
          );

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
              <Image
                // src={`/images/quran/${page}.jpg`}
                src={`https://ik.imagekit.io/hefz/quran/${page}.webp`}
                id={`page-${page}`}
                alt={`صفحة ${page}`}
                width={imageWidth}
                height={imageHeight}
                className="absolute top-0 left-0 w-full h-full object-contain z-0"
                // priority={page <= 3}
                loading={page === currentPage ? "eager" : "lazy"}
                priority={page === currentPage}
              />

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

      <div className="flex-none h-12 md:h-16">
      <Footer currentPageRange={currentPageRange}  highlightVerse={highlightVerse} />
      </div>

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
