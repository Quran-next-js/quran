// hafs/VerseOffcanvas.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const MeaningsTab = dynamic(() => import('./tabs/MeaningsTab'), { ssr: false });
const TafseerTab = dynamic(() => import('./tabs/TafseerTab'), { ssr: false });
const NzoolTab = dynamic(() => import('./tabs/NzoolTab'), { ssr: false });
const ReflectionTab = dynamic(() => import('./tabs/ReflectionTab'), { ssr: false });
const TnasobTab = dynamic(() => import('./tabs/TnasobTab'), { ssr: false });
const GrammarTab = dynamic(() => import('./tabs/GrammarTab'), { ssr: false });
const ReadingTab = dynamic(() => import('./tabs/ReadingTab'), { ssr: false });
const SimilaritiesTab = dynamic(() => import('./tabs/SimilaritiesTab'), { ssr: false });


const tabs = [
  { key: "meanings", label: "معاني", icon: '/images/logo/verse_icon/meaning.webp' },
  { key: "tafseer", label: "تفسير", icon: '/images/logo/verse_icon/tfseer.webp' },
  { key: "reasons", label: "أسباب النزول", icon: '/images/logo/verse_icon/nzool.webp' },
  { key: "reflection", label: "تدبر", icon: '/images/logo/verse_icon/reflection.webp' },
  { key: "relation", label: "الربط والتناسب", icon: '/images/logo/verse_icon/tnasob.webp' },
  { key: "grammar", label: "الإعراب", icon: '/images/logo/verse_icon/grammer.webp' },
  { key: "readings", label: "القراءات", icon: '/images/logo/verse_icon/reading.webp' },
  { key: "similar", label: "متشابهات", icon: '/images/logo/verse_icon/smilise.webp' },
];

export default function VerseOffcanvas({ selectedVerse, setSelectedVerse, scrollToPage, versesData }) {


  useEffect(() => {
    if (selectedVerse?.page_number && scrollToPage) {
      scrollToPage(selectedVerse.page_number);
    }
  }, [selectedVerse?.page_number]);

  const getVersesByPage = (pageNumber) => {
    return versesData.filter((v) => v.page_number === pageNumber);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setSelectedVerse(samePageVerses[currentIndex - 1]);
    } else {
      const previousPage = selectedVerse.page_number - 1;
      const previousVerses = getVersesByPage(previousPage);
      if (previousVerses.length > 0) {
        setSelectedVerse(previousVerses[previousVerses.length - 1]);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < samePageVerses.length - 1) {
      setSelectedVerse(samePageVerses[currentIndex + 1]);
    } else {
      const nextPage = selectedVerse.page_number + 1;
      const nextVerses = getVersesByPage(nextPage);
      if (nextVerses.length > 0) {
        setSelectedVerse(nextVerses[0]);
      }
    }
  };

  const samePageVerses = selectedVerse
    ? versesData.filter((v) => v.page_number === selectedVerse.page_number)
    : [];
  const currentIndex = samePageVerses.findIndex(
    (v) =>
      v.chapter_id === selectedVerse?.chapter_id &&
      v.verse_number === selectedVerse?.verse_number
  );


  const [activeTab, setActiveTab] = useState("meanings");
  const tabRefs = useRef({});

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  function getTabContent(tabKey) {
    if (!selectedVerse) return null;
    switch (tabKey) {
      case "meanings":
        return <MeaningsTab selectedVerse={selectedVerse} />;
      case "tafseer":
        return <TafseerTab selectedVerse={selectedVerse} />;
      case "reasons":
        return <NzoolTab selectedVerse={selectedVerse} />;
      case "reflection":
        return <ReflectionTab selectedVerse={selectedVerse} />;
      case "relation":
        return <TnasobTab selectedVerse={selectedVerse} />;
      case "grammar":
        return <GrammarTab selectedVerse={selectedVerse} />;
      case "readings":
        return <ReadingTab selectedVerse={selectedVerse} />;
      case "similar":
        return <SimilaritiesTab selectedVerse={selectedVerse} />;
      default:
        return <p className="text-dark">المحتوى غير متاح حاليًا.</p>;

    }
  }
  return (
    <div
      className={`offcanvas offcanvas-bottom ${selectedVerse ? "show" : ""}`}
      tabIndex="-1"
      style={{ visibility: selectedVerse ? "visible" : "hidden", height: "85%" }}
    >
      <div className="offcanvas-header bg-green-600 text-white">
        <h5 className="offcanvas-title text-white text-lg">   <span className="text-gray-950 ms-2"> [ {selectedVerse?.chapter_name} ]</span>    صفحة : <span className="text-gray-950 ms-2"> [ {selectedVerse?.page_number} ] </span>  آيه :  <span className="text-gray-950 ms-2"> [ {selectedVerse?.verse_number} ] </span></h5>
        <button
          type="button"
          className="btn-close text-reset bg-white"
          onClick={() => setSelectedVerse(null)}
        ></button>
      </div>
      <h4 className="text-center py-4 ayah">
        <span className="qous"> ﴿ </span>
        {
          selectedVerse?.text_uthmani?.split(" ").length > 5
            ? selectedVerse.text_uthmani.split(" ").slice(0, 5).join(" ") + " ..."
            : selectedVerse?.text_uthmani
        }
        <span className="qous"> ﴾ </span>
      </h4>
      <div className=" bg-green-100 text-dark d-flex justify-content-around p-1 text-sm">
        <button
          className={`btn btn-sm ${currentIndex === 0 ? 'btn-warning' : 'btn-primary'}`}
          onClick={goToPrevious}
        >
          {currentIndex === 0 ? "الصفحة السابقة" : "الآية السابقة"}
        </button>
        <div className="text-center">
          <p className="mb-0">{currentIndex + 1} / {samePageVerses.length}   </p>
        </div>
        <button
          className={`btn btn-sm ${currentIndex === samePageVerses.length - 1 ? 'btn-warning' : 'btn-primary'}`}
          onClick={goToNext}
        >
          {currentIndex === samePageVerses.length - 1 ? "الصفحة التالية" : "الآية التالية"}
        </button>
      </div>
      {/* tabs */}
      <div className="offcanvas-body text-center fs-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getTabContent(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950/80 backdrop-blur-md flex overflow-x-auto no-scrollbar border-t border-sky-800 z-10">
        {tabs.map((tab) => (
          <motion.button
            whileTap={{ scale: 0.9 }}
            key={tab.key}
            ref={(el) => (tabRefs.current[tab.key] = el)}
            className={`flex flex-col items-center justify-center flex-1 min-w-[80px] py-2 transition duration-200
        ${activeTab === tab.key
                ? "text-yellow-400 font-bold"
                : "text-white hover:text-yellow-300"
              }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="text-xl">
              <Image
                src={tab.icon} 
                alt={`${tab.label} icon`} 
                width={30}
                height={30} 
                loading= "lazy"
              />
            </div>
            <span className="text-[11px] mt-1">{tab.label}</span>
            {activeTab === tab.key && (
              <div className="mt-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
