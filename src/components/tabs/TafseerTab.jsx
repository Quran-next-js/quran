"use client";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

const cache = new Map();

const tafseerSources = [
  {
    id: "moyser",
    label: "التفسير الميسر",
    path: "tfseer_moyser",
  },
  {
    id: "mokhtasar",
    label: "المختصر في التفسير",
    path: "tfseer_mokhtser",
  },
  {
    id: "sady",
    label: "تفسير السعدي",
    path: "tfseer_sady",
  },
  {
    id: "ayser",
    label: "أيسر التفاسير",
    path: "tfsseer_ayser_al_ltfseer",
  },
  // { id: "montkhab", label: "المنتخب", path: "tfseer_montkhab",},
];

export default function TafseerTab({ selectedVerse }) {
  const [tafaseerData, setTafaseerData] = useState([]);

  useEffect(() => {
    if (!selectedVerse) return;

    const chapterId = selectedVerse.chapter_id;
    const verseNumber = selectedVerse.verse_number;

    const fetchAllTafaseer = async () => {
      const results = [];

      for (const tafseer of tafseerSources) {
        const cacheKey = `${tafseer.id}-${chapterId}`;

        let data;
        if (cache.has(cacheKey)) {
          data = cache.get(cacheKey);
        } else {
          try {
            const res = await fetch(`/data/${tafseer.path}/${chapterId}.json`, {
              headers: { "Cache-Control": "public, max-age=31536000" },
            });
            data = await res.json();
            cache.set(cacheKey, data);
          } catch (error) {
            console.error(`خطأ في تحميل تفسير ${tafseer.label}:`, error);
            continue;
          }
        }

        const verseTafseer = data.find(item => item.t_verse_number === verseNumber);
        if (verseTafseer) {
          results.push({
            id: tafseer.id,
            label: tafseer.label,
            content: verseTafseer.tafseer,
          });
        }
      }

      setTafaseerData(results);
    };

    fetchAllTafaseer();
  }, [selectedVerse]);

  if (tafaseerData.length === 0) {
    return (
      <div className="text-muted text-center p-4 bg-sky-900/5">
        <p>لا توجد بيانات تفسير لهذه الآية..</p>
      </div>
    );
  }

  return (
    <Tabs
      defaultActiveKey={tafaseerData[0]?.id}
      id="tafseer-tabs"
      className="mb-3 text-end flex-row-reverse"
      fill
    >
      {tafaseerData.map((tafseer) => (
        <Tab
          key={tafseer.id}
          eventKey={tafseer.id}
          title={tafseer.label}
          className="text-end"
        >
          <div className="border border-sky-700 p-3 rounded-lg text-justify leading-loose text-lg">
            <p dangerouslySetInnerHTML={{ __html: tafseer.content }}></p>
          </div>
        </Tab>
      ))}
    </Tabs>
  );
}
