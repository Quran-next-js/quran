import Offcanvas from "react-bootstrap/Offcanvas";
import Link from 'next/link'

export default function SettingOffcanvas({ isOpen, setIsOpen }) {
  return (
    <Offcanvas
      show={isOpen}
      onHide={() => setIsOpen(false)}
      placement="bottom"
      scroll
      backdrop
      style={{ height: '70%' }}
    >
      <Offcanvas.Header closeButton className="bg-green-600 text-white" style={{ direction: "rtl" }}>
        <Offcanvas.Title> الإعدادات </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="text-justify text-lg" style={{ direction: "rtl" }}>
        <h4 className="text-lg font-bold mb-2 p-2 bg-green-300">معلومات عن المشروع</h4>
        <p className="mb-3">
        مصحف الحفظ الميسر يهدف إلى تيسير حفظ القرآن الكريم وفهم معانيه وتدبر آياته والعمل بتعاليمه. يوفر المصحف أدوات مبتكرة  تساعد المستخدمين على تحقيق أهدافهم في تعلم القرآن الكريم بأسلوب مبسط وفعال. انضم إلى مجتمعنا وابدأ رحلتك القرآنية اليوم.
        </p>
        
        <p className="text-muted">
          جاري العمل على إضافة إعدادات متقدمة قريبًا بإذن الله.
        </p>
      </Offcanvas.Body>

      <div className="offcanvas-footer bg-green-600 text-white d-flex justify-content-around p-3 text-sm">
        <p className="text-center"> مصحف الحفظ الميسر &copy; 2025</p>
        <p className="text-center"> BY :
         <Link href="https://alaaamer.net" target="_blank">
          <span className="font-bold text-white"> Alaa Amer </span>
         </Link>
         </p>
      </div>

    </Offcanvas>
  );
}
