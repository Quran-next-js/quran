"use client";

import { useRouter, usePathname } from "next/navigation";

export default function MushafSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const mushafs = [
    { id: "hafs", name: "رواية حفص", available: true },
    { id: "warsh", name: "رواية ورش", available: true },
    { id: "qaloon", name: "قالون", available: false },
  ];

  const currentMushaf = pathname.split("/")[1] || "hafs";

  const handleChange = (id) => {
    if (id !== currentMushaf) {
      router.push(`/${id}`);
    }
  };

  return (
    <div className="p-1 text-right mb-3 mt-2 shadow-md border border-gray-600 rounded-lg">
      <h5 className="font-bold text-xl mb-2">اختيار المصحف:</h5>
      <div className="d-flex justify-content-around">
        {mushafs.map((mushaf) => (
          <button
            key={mushaf.id}
            disabled={!mushaf.available}
            onClick={() => handleChange(mushaf.id)}
            className={`px-4 py-2 rounded-xl text-white text-lg font-semibold 
              ${mushaf.id === currentMushaf ? "bg-blue-800 border border-blue-600" : "bg-green-500 hover:bg-green-600"} 
              ${!mushaf.available && "opacity-20 cursor-not-allowed"}`}
          >
            {mushaf.name} {!mushaf.available && " (قريبًا)"}
          </button>
        ))}
      </div>
    </div>
  );
}
