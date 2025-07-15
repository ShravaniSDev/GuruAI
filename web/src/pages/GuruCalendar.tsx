import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

export default function GuruCalendar() {
  const [markedDays, setMarkedDays] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("guruai_progress_data");
    if (raw) {
      const { lastCheckIn } = JSON.parse(raw);
      setMarkedDays([lastCheckIn]); // You can expand this with full history later
    }
  }, []);

  return (
    <div className="text-white max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">🗓️ Guru Calendar</h1>
      <p className="text-gray-400">Your progress check-ins calendar</p>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const today = new Date();
          const currentMonth = format(today, "yyyy-MM");
          const key = `${currentMonth}-${String(day).padStart(2, "0")}`;
          const isMarked = markedDays.includes(key);

          return (
            <div
              key={key}
              className={`w-10 h-10 flex items-center justify-center rounded-md ${
                isMarked ? "bg-green-500 text-black" : "bg-gray-700 text-white"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
