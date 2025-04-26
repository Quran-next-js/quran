// hafs/VerseOffcanvas.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaLightbulb, FaQuestionCircle, FaBrain, FaLink, FaFileAlt, FaVolumeUp, FaClone } from "react-icons/fa";
import versesData from "@/data/verses.json";
import MeaningsTab from "./tabs/MeaningsTab";
import TafseerTab from "./tabs/TafseerTab";
import NzoolTab from "./tabs/NzoolTab";
import ReflectionTab from "./tabs/ReflectionTab";
import TnasobTab from "./tabs/TnasobTab";
import GrammarTab from "./tabs/GrammarTab";
import ReadingTab from "./tabs/ReadingTab";
import SimilaritiesTab from "./tabs/SimilaritiesTab";


const tabs = [
  { key: "meanings", label: "معاني", icon: <FaLightbulb /> },
  { key: "tafseer", label: "تفسير", icon: <FaBookOpen /> },
  { key: "reasons", label: "أسباب النزول", icon: <FaQuestionCircle /> },
  { key: "reflection", label: "تدبر", icon: <FaBrain /> },
  { key: "relation", label: "الربط والتناسب", icon: <FaLink /> },
  { key: "grammar", label: "الإعراب", icon: <FaFileAlt /> },
  { key: "readings", label: "القراءات", icon: <FaVolumeUp /> },
  { key: "similar", label: "متشابهات", icon: <FaClone /> },
];

export default function VerseOffcanvas({ selectedVerse, setSelectedVerse, scrollToPage }) {


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
        return <SimilaritiesTab selectedVerse={selectedVerse}  />;
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
        <h5 className="offcanvas-title text-white text-lg"> سورة  <span className="text-black ms-2"> [ {selectedVerse?.chapter_name} ]</span>  آيه رقم  <span className="text-black ms-2"> [ {selectedVerse?.verse_number} ] </span>   </h5>
        <button
          type="button"
          className="btn-close text-reset bg-white"
          onClick={() => setSelectedVerse(null)}
        ></button>
      </div>
      <h4 className="text-center py-3 ayah">
        <span className="qous"> ﴿ </span>
        {
          selectedVerse?.text_uthmani?.split(" ").length > 5
            ? selectedVerse.text_uthmani.split(" ").slice(0, 5).join(" ") + " ..."
            : selectedVerse?.text_uthmani
        }
        <span className="qous"> ﴾ </span>
      </h4>
      {/* tabs */}
      <div className={`flex overflow-x-auto no-scrollbar gap-3 px-2 ${activeTab === "reflection" ? "py-4" : "py-2"} border-b border-sky-800 bg-rose-950`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(el) => (tabRefs.current[tab.key] = el)}
            className={`flex-none flex flex-col items-center justify-center text-sm min-w-[50px] px-1 py-2 transition duration-200 ${activeTab === tab.key
              ? "text-yellow-400 font-semibold"
              : "text-white hover:text-yellow-300"
              }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <div className="text-lg">{tab.icon}</div>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
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

      <div className="offcanvas-footer bg-green-600 text-white d-flex justify-content-around p-1 text-sm">
        <button
          className={`btn btn-sm ${currentIndex === 0 ? 'btn-warning' : 'btn-primary'}`}
          onClick={goToPrevious}
        >
          {currentIndex === 0 ? "الصفحة السابقة" : "الآية السابقة"}
        </button>

        <div className="text-center">
          <p className="text-white mb-0">{currentIndex + 1} / {samePageVerses.length}</p>
          <p className="text-white mb-0">صفحة {selectedVerse?.page_number}</p>
        </div>

        <button
          className={`btn btn-sm ${currentIndex === samePageVerses.length - 1 ? 'btn-warning' : 'btn-primary'}`}
          onClick={goToNext}
        >
          {currentIndex === samePageVerses.length - 1 ? "الصفحة التالية" : "الآية التالية"}
        </button>
      </div>
    </div>
  );
}
