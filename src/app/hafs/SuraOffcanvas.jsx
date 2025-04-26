// hafs/SuraOffcanvas.jsx
"use client";

export default function SuraOffcanvas({ suraMap, suraNames, scrollToPage }) {
  return (
    <div
      className="offcanvas offcanvas-end text-bg-light"
      tabIndex="-1"
      id="suraList"
      aria-labelledby="suraListLabel"
    >
      <div className="offcanvas-header bg-green-600 text-white">
        <h5 className="offcanvas-title surahName" id="suraListLabel">قائمة السور</h5>
        <button
          type="button"
          className="btn-close text-reset text-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <ul className="grid grid-cols-1 gap-3">
          {suraNames.map((sura, index) => (
            <li
              key={sura}
              className="flex items-center justify-between bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition hover:bg-green-50"
              onClick={() => {
                const page = suraMap[sura];
                scrollToPage(page);
                document.querySelector(".offcanvas.show .btn-close")?.click();
              }}
            >
              {/* رقم السورة داخل مستطيل أخضر */}
              <div className="bg-green-600 text-white w-10 h-full flex items-center justify-center text-lg font-bold">
                {index + 1}
              </div>

              {/* اسم السورة */}
              <div className="flex-1 p-3 text-right juzName">
                سورة {sura}
                {/* صفحة السورة */}
                <span className="text-gray-500 text-xs float-left">   صفحة {suraMap[sura]} </span>
              </div>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}
