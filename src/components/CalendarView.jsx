import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ sessions }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

const renderCells = () => {
  const rows = [];
  let days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(day);
      const sessionsOnDay = sessions.filter(s => {
        const sessionDate = s.dateTime || s.scheduledTime;
        return isSameDay(new Date(sessionDate), cloneDay);
      });

      days.push(
        <div
          key={cloneDay.toISOString()}
          className={`p-2 h-28 flex flex-col border-t border-r border-gray-700 ${
            cloneDay.getMonth() !== currentDate.getMonth() ? "text-gray-500" : "text-white"
          } ${isSameDay(new Date(), cloneDay) ? "bg-yellow-400/10" : ""}`}
        >
          <span className="font-medium">{cloneDay.getDate()}</span>
          <div className="flex-grow overflow-y-auto text-xs mt-1 space-y-1">
            {sessionsOnDay.map((session) => {
              // Determine session status color
              let bgColor = "bg-gray-500/30";
              if (session.status === "upcoming") bgColor = "bg-green-500/30";
              else if (session.status === "ongoing") bgColor = "bg-yellow-400/40";
              else if (session.status === "completed") bgColor = "bg-gray-700/40";

              return (
                <div key={session._id} className={`${bgColor} p-1 rounded text-white`}>
                  <span className="font-semibold">{session.title || "Session"}</span>
                  <span className="ml-1 text-[10px] italic lowercase">
                    ({session.status})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
      day.setDate(day.getDate() + 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }
  return rows;
};



    return (
        <div className="gradient-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronLeft /></button>
                <h2 className="text-xl font-semibold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 text-center font-medium text-gray-400 mb-2">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="border-l border-b border-gray-700">
                {renderCells()}
            </div>
        </div>
    );
};

export default CalendarView;
