// mushaf_hefz/src/app/hafs/tabs/SimilaritiesTab.jsx
"use client";
import React, { useEffect, useState, useRef } from "react";

export default function SimilaritiesTab({ selectedVerse }) {
  const [similaritie, setSimilaritie] = useState([]);
  const cacheRef = useRef({});

  useEffect(() => {
    if (!selectedVerse || !selectedVerse.chapter_id) return;

    const chapterId = selectedVerse.chapter_id;
    const verseId = Number(selectedVerse.verse_id || selectedVerse.id);

    const fetchAndFilter = async () => {
      try {
        if (cacheRef.current[chapterId]) {
          const match = cacheRef.current[chapterId].find(
            (item) => item.verse_id === verseId
          );
          setSimilaritie(match?.elements || []);
        } else {
          const res = await fetch(`/data/similarities/${chapterId}.json`);
          const data = await res.json();
          cacheRef.current[chapterId] = data;

          const match = data.find((item) => item.verse_id === verseId);
          setSimilaritie(match?.elements || []);
        }
      } catch (err) {
        console.error("❌ خطأ أثناء تحميل بيانات المتشابهات:", err);
        setSimilaritie([]);
      }
    };

    fetchAndFilter();
  }, [selectedVerse]);

  if (!selectedVerse || (!selectedVerse.id && !selectedVerse.verse_id)) {
    return <p className="text-center text-muted mt-3">لا توجد آية محددة</p>;
  }

  if (!similaritie.length) {
    return (
      <div className="text-muted text-center p-4 bg-sky-900/5">
        <p> لا توجد بيانات متشابهات لهذه الآية..</p>
      </div>
    );
  }

  return (
    <div className="col-lg-12 mt-3">
      <div className="table-responsive">
        <table className="table table-bordered table-sm mt-3">
          <tbody className="text-center">
            {similaritie.map((item, index) => (
              <tr key={index}>
                <td className="mean">
                  {(item.part_1 || item.part_2 || item.part_3) && <span className="qous">﴿</span>}
                  {item.part_1 || ""}{" "}
                  <span className="text-danger">{item.part_2 || ""}</span>{" "}
                  {item.part_3 || ""}
                  {(item.part_1 || item.part_2 || item.part_3) && <span className="qous">﴾</span>}
                  <span className="smallname">
                    {item.sim_chapter_name || ""} [ {item.sim_verse_number || "؟"} ]
                  </span>
                  {item.soptLight && <p className="text-muted soptLight">{item.soptLight}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
