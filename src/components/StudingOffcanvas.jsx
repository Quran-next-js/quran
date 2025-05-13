"use client";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useEffect, useState } from "react";

export default function StudingOffcanvas({ isOpen, setIsOpen, chapterId }) {
  const [studyData, setStudyData] = useState(null);

  useEffect(() => {
    if (!chapterId) return;

    fetch(`/data/chapter_studies/${chapterId}.json`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Study data:", data);
        const firstEntry = data[0]; // <-- هذا هو الكائن الفعلي
        setStudyData(firstEntry);
      })
      .catch((err) => console.error("Error loading study data:", err));
  }, [chapterId]);

  const parseSection = (sectionStr) => {
    try {
      return JSON.parse(sectionStr);
    } catch {
      return null;
    }
  };

  if (!isOpen) return null;

  const section1 = studyData?.section_1 ? parseSection(studyData.section_1) : null;
  const section2 = studyData?.section_2 ? parseSection(studyData.section_2) : null;
  const section3 = studyData?.section_3 ? parseSection(studyData.section_3) : null;

  return (

    <Offcanvas
      show={isOpen}
      onHide={() => setIsOpen(false)}
      placement="bottom"
      scroll
      backdrop
      style={{ height: '85%' }}
    >
      <Offcanvas.Header closeButton className="bg-green-600 text-white" style={{ direction: "rtl" }}>
        <Offcanvas.Title>  مدارسة سورة {studyData?.name_arabic || ""} </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="text-justify text-lg" style={{ direction: "rtl" }}>
        {studyData?.title && (
          <h4 className="text-lg font-bold mb-2 p-2 custom-bg text-center rounded"> {studyData.title} </h4>
        )}
        {/* //   {/* عرض الأقسام */}
        {[section1, section2, section3].map((section, idx) => (
          section ? (
            <div key={idx} className="mb-6">
              {section.keys.map((key, i) => (
                <div key={i} className="mb-3">
                  <div className="text-2xl font-semibold text-blue-700 text-primary-emphasis p-2">{key}</div>
                  <div className="text-2xl mt-1 leading-relaxed">{section.values[i]}</div>
                </div>
              ))}
            </div>
          ) : null
        ))}

        {!studyData?.title && !section1 && !section2 && !section3 && (
          <div className="text-sm text-gray-500 text-center">لا توجد بيانات للعرض</div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
