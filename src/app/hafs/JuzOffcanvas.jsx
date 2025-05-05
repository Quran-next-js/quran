// hafs/JuzOffcanvas.jsx
"use client";

export default function JuzOffcanvas({ juzMap, juzNumbers, scrollToPage }) {
  const arabicOrdinals = [
    "الأول", "الثاني", "الثالث", "الرابع", "الخامس",
    "السادس", "السابع", "الثامن", "التاسع", "العاشر",
    "الحادي عشر", "الثاني عشر", "الثالث عشر", "الرابع عشر", "الخامس عشر",
    "السادس عشر", "السابع عشر", "الثامن عشر", "التاسع عشر", "العشرون",
    "الحادي والعشرون", "الثاني والعشرون", "الثالث والعشرون", "الرابع والعشرون", "الخامس والعشرون",
    "السادس والعشرون", "السابع والعشرون", "الثامن والعشرون", "التاسع والعشرون", "الثلاثون"
  ];

  const getArabicOrdinal = (num) => arabicOrdinals[num - 1] || num;

  return (
    <div
      className="offcanvas offcanvas-start offcanvas-custom-bg"
      tabIndex="-1"
      id="juzList"
      aria-labelledby="juzListLabel"
    >
      <div className="offcanvas-header bg-green-600 text-white">
        <h5 className="offcanvas-title juzName " id="juzListLabel">قائمة الأجزاء</h5>
        <button
          type="button"
          className="btn-close text-reset text-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="grid grid-cols-1 gap-3">
          {juzNumbers.map((juz) => (
            <li
              key={juz}
              className="flex items-center justify-between  rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:bg-green-50 border border-gray-600"
              onClick={() => {
                const page = juzMap[juz];
                scrollToPage(page);
                document.querySelector(".offcanvas.show .btn-close")?.click();
              }}
            >
              {/* رقم الجزء داخل مستطيل أخضر */}
              <div className="bg-green-600 text-white w-10 h-full flex items-center justify-center text-lg font-bold">
                {juz}
              </div>

              {/* اسم الجزء (مثلاً "الجزء الأول") */}
              <div className="flex-1 p-2 text-right juzName">
                الجزء {getArabicOrdinal(Number(juz))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
