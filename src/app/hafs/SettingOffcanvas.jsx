import { Offcanvas, Accordion } from "react-bootstrap";
import Link from "next/link";

export default function SettingOffcanvas({ isOpen, setIsOpen }) {
  return (
    <Offcanvas
      show={isOpen}
      onHide={() => setIsOpen(false)}
      placement="bottom"
      scroll
      backdrop
      style={{ height: "70%" }}
    >
      <Offcanvas.Header
        closeButton
        className="bg-green-600 text-white"
        style={{ direction: "rtl" }}
      >
        <Offcanvas.Title>الإعدادات</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ direction: "rtl" }}>
        <Accordion defaultActiveKey="0" alwaysOpen>
          {/* عن المصحف */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className="text-right w-full text-2xl font-bold"> التعريف بالمصحف : </span>
            </Accordion.Header>
            <Accordion.Body>
              <div className="text-lg leading-loose text-justify space-y-1">
                <p className="text-sky-900 leading-loose text-justify text-lg">
                  مصحف الحفظ الميسر يهدف إلى تيسير حفظ القرآن الكريم وفهم معانيه وتدبر آياته والعمل بتعاليمه. يوفر المصحف أدوات مبتكرة تساعد المستخدمين على تحقيق أهدافهم في تعلم القرآن الكريم بأسلوب مبسط وفعال. انضم إلى مجتمعنا وابدأ رحلتك القرآنية اليوم.
                </p>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* معلومات */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <span className="text-right w-full text-2xl font-bold"> معلومات التطبيق :</span>
            </Accordion.Header>
            <Accordion.Body>
              <div className="text-xl font-bold text-sky-900 space-y-3">
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
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* جهة التطوير */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <span className="text-right w-full text-2xl font-bold">  معلومات التطوير : </span>
            </Accordion.Header>
            <Accordion.Body>
              <div className="text-xl font-bold text-sky-900 space-y-3">
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

          {/* ملاحظات */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <span className="text-right w-full text-2xl font-bold"> الإعدادات المتقدمة : </span>
            </Accordion.Header>
            <Accordion.Body>
              <p className="text-muted mt-2">
                جاري العمل على إضافة إعدادات متقدمة قريبًا بإذن الله.
              </p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
