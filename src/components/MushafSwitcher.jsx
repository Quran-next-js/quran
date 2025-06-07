"use client";

import { useRouter, usePathname } from "next/navigation";

export default function MushafSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const mushafs = [
    { id: "madina", name: "مصحف المدينة - حفص", available: true },
    { id: "hafs", name: "الحفظ الميسر - حفص", available: true },
    { id: "warsh", name: "الحفظ الميسر - ورش", available: true },
    { id: "qaloon", name: "قالون", available: false },
  ];

  const currentMushaf = pathname.split("/")[1] || "hafs";

  const handleChange = (id) => {
    if (id !== currentMushaf) {
      router.push(`/${id}`);
    }
  };

  return (
    <div className="p-4 text-right mb-4 mt-3 shadow-md border border-gray-600 rounded-lg">
      <h5 className="font-bold text-xl mb-4">اختيار المصحف:</h5>
      <div className="flex flex-wrap gap-3">
        {mushafs.map((mushaf) => (
          <button
            key={mushaf.id}
            disabled={!mushaf.available}
            onClick={() => handleChange(mushaf.id)}
            className={`w-full sm:w-[48%] px-2 py-2 rounded-xl text-white text-lg font-semibold transition 
          ${mushaf.id === currentMushaf ? "bg-blue-800 border border-blue-600" : "bg-green-500 hover:bg-green-600"} 
          ${!mushaf.available && "opacity-40 cursor-not-allowed"}`}
          >
            {mushaf.name} {!mushaf.available && " (قريبًا)"}
          </button>
        ))}
      </div>
    </div>
  );


}
