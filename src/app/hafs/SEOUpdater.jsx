"use client";
import { useEffect } from "react";
import metaData from "@/data/verses.json";

function SEOUpdater({ currentPage }) {
  useEffect(() => {
    const pageMeta = metaData.find((item) => item.page_number === currentPage);

    if (pageMeta) {
      document.title = `الحفظ الميسر - سورة ${pageMeta.chapter_name} صفحة رقم ${pageMeta.page_number}`;
    }
  }, [currentPage]);

  return null; // لم نعد بحاجة لعنصر Head
}

export default SEOUpdater;
