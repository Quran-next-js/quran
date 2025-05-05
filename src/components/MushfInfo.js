"use client";

import { Accordion } from "react-bootstrap";
import Link from "next/link";

export default function MushfInfo() {
  return (
    <>
      {/* عن المصحف */}
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <span className="text-right w-full text-2xl font-bold">
            التعريف بالمصحف :
          </span>
        </Accordion.Header>
        <Accordion.Body>
          <div className="text-lg leading-loose text-justify space-y-1">
            <p className="leading-loose text-justify text-lg">
              مصحف الحفظ الميسر يهدف إلى تيسير حفظ القرآن الكريم وفهم معانيه
              وتدبر آياته والعمل بتعاليمه. يوفر المصحف أدوات مبتكرة تساعد
              المستخدمين على تحقيق أهدافهم في تعلم القرآن الكريم بأسلوب مبسط
              وفعال. انضم إلى مجتمعنا وابدأ رحلتك القرآنية اليوم.
            </p>
          </div>
          <div className="text-xl font-bold space-y-3">
            <div className="flex justify-between bg-sky-900/5 p-2 rounded">
              <span>الإصدار :</span> <span>1.0.01</span>
            </div>
            <div className="flex justify-between bg-sky-900/5 p-2 rounded">
              <span>التاريخ :</span> <span>2025</span>
            </div>
            <div className="flex justify-between bg-sky-900/5 p-2 rounded">
              <span> التواصل :</span>
              <span>
                <Link
                  href="mailto:alaaamer99999@gmail.com"
                  target="_blank"
                  className="text-lg text-blue-700 underline"
                >
                  تواصل معنا
                </Link>
              </span>
            </div>
            <div className="flex justify-between bg-sky-900/5 p-2 rounded">
              <span>المؤسسة :</span> <span>الحفظ الميسر</span>
            </div>
            <div className="flex justify-between bg-sky-900/5 p-2 rounded">
              <span>البرمجة :</span>
              <span>
                <Link
                  href="https://alaaamer.net"
                  target="_blank"
                  className="text-sm text-blue-700 underline"
                >
                  Alaa Amer
                </Link>
              </span>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </>
  );
}
