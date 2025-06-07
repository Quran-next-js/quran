"use client";

import { useEffect, useRef, useState } from "react";

export default function ReminderTime() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("08:00");

  const timeoutRef = useRef(null); // للـ setTimeout
  const dailyIntervalRef = useRef(null); // للـ setInterval اليومي
  const audioRef = useRef(null);

  // استرجاع الإعدادات من التخزين المحلي
  useEffect(() => {
    const savedEnabled = localStorage.getItem("reminderEnabled") === "true";
    const savedTime = localStorage.getItem("reminderTime") || "08:00";

    setReminderEnabled(savedEnabled);
    setReminderTime(savedTime);

    if (savedEnabled && Notification.permission === "granted") {
      scheduleNextReminder(savedTime);
    }
  }, []);
  // وظيفة التذكير: إشعار + صوت
  function triggerReminder() {
    // إشعار
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("📖 تذكير", {
          body: "حان وقت مراجعة وردك اليومي من القرآن الكريم.",
          icon: "/ios/192.png",
          lang: "ar",
          dir: "rtl",
        });
      } catch (err) {
        console.warn("حدث خطأ في عرض الإشعار:", err);
      }
    } else {
      alert("📖 حان وقت مراجعة وردك اليومي من القرآن الكريم.");
    }
    // تشغيل الصوت
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch((err) => {
        console.warn("لم يتم تشغيل الصوت:", err);
      });
    }
  }

  // جدولة التذكير التالي
  function scheduleNextReminder(time) {
    clearTimeout(timeoutRef.current);
    clearInterval(dailyIntervalRef.current);

    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    const next = new Date();

    next.setHours(hours, minutes, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1); // التذكير غدًا

    const delay = next.getTime() - now.getTime();

    timeoutRef.current = setTimeout(() => {
      triggerReminder();
      dailyIntervalRef.current = setInterval(
        triggerReminder,
        24 * 60 * 60 * 1000
      ); // كل 24 ساعة
    }, delay);
  }

  // عند تفعيل/تعطيل التذكير
  const handleToggleReminder = () => {
    if (!reminderEnabled) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setReminderEnabled(true);
          localStorage.setItem("reminderEnabled", "true");
          localStorage.setItem("reminderTime", reminderTime);
          scheduleNextReminder(reminderTime);
          alert("✅ تم تفعيل التذكير اليومي.");
        } else {
          alert("❌ لم يتم منح الإذن للتنبيهات.");
        }
        if (permission === "denied") {
          alert(
            "❌ لقد قمت مسبقًا برفض التنبيهات. من فضلك فعّل الإشعارات يدويًا من إعدادات المتصفح."
          );
          return;
        }
      });
    } else {
      setReminderEnabled(false);
      localStorage.setItem("reminderEnabled", "false");
      clearTimeout(timeoutRef.current);
      clearInterval(dailyIntervalRef.current);
      alert("📴 تم إيقاف التذكير.");
    }
  };

  // عند تغيير وقت التذكير
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    localStorage.setItem("reminderTime", newTime);

    if (reminderEnabled) {
      scheduleNextReminder(newTime);
      alert("⏰ تم تحديث وقت التذكير.");
    }
  };

  return (
    <div className="p-1 text-right mb-3 mt-2 shadow-md border border-gray-600 rounded-lg">
      <div className="d-flex justify-between align-items-center">
      <h4 className="text-lg">  التذكير اليومي </h4>
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleToggleReminder}
        >
          {reminderEnabled ? "إيقاف التذكير" : "تفعيل التذكير"}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="reminderTime">وقت التذكير:</label>
        <input
          type="time"
          id="reminderTime"
          value={reminderTime}
          onChange={handleTimeChange}
          className="border rounded px-2 py-1"
        />
      </div>
      {/* مشغل الصوت الخفي */}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />
    </div>
  );
}
