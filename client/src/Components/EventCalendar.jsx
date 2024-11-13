import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isToday, startOfMonth } from "date-fns";
import { WEEKDAYS } from "../utils/event";
import clsx from "clsx";
import { useState } from "react";

const EventCalendar = ({ events }) => {
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    const [date, setDate] = useState("");
    const [display, setDisplay] = useState(false);

    const callPopup = (day) => {
        setDate(day);
        setDisplay(true);
    };

    const addEvent = () => {
        setDisplay(false);
        // Event addition logic can be added here
    };

    const removeEvent = () => {
        setDisplay(false);
        // Event removal logic can be added here
    };

    const startingDayIndex = getDay(firstDayOfMonth);

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-center font-bold text-3xl mb-6">{format(currentDate, "MMMM yyyy")}</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="font-bold text-center text-gray-700">{day}</div>
                ))}

                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="border rounded-md text-center p-4 " />
                ))}

                {daysInMonth.map((day, i) => (
                    <div
                        key={`day-${i}`}
                        className={clsx(
                            "border rounded-md text-center p-2 relative cursor-pointer hover:bg-blue-100 transition-colors",
                            {
                                "bg-blue-200 text-gray-900": isToday(day),
                            }
                        )}
                        onClick={() => callPopup(day)}
                    >
                        {format(day, "d")}
                        {events.filter((event) => isSameDay(event.date, day)).map((event, i) => (
                            <div
                                key={`event-${i}`}
                                className="bg-green-500 rounded-md text-white mt-1 text-xs p-1 truncate"
                            >
                                {event.title}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {display && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <div className="w-[300px] p-6 bg-white rounded-lg shadow-lg">
                        <p className="text-black mb-4">Date: {format(date, 'PP')}</p>
                        <input
                            className="border rounded-md w-full p-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            placeholder="Enter event name"
                        />
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={addEvent}
                            >
                                Add +
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                onClick={removeEvent}
                            >
                                Remove -
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
