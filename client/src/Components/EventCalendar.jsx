import {
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isSameDay,
    isToday,
    startOfMonth,
} from "date-fns";
import clsx from "clsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CloudinaryContext, Image, Video } from 'cloudinary-react'; 

// Constants for week day names
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [date, setDate] = useState("");
    const [display, setDisplay] = useState(false);
    const [eventName, setEventName] = useState("");
    const [media, setMedia] = useState(null); // New state for media (image/video)
    const [fileName, setFileName] = useState(""); // State for the selected file's name
    
    // Cloudinary config (make sure to replace with your own Cloudinary config)
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dckua3qdp/image/upload';
    const cloudinaryVideoUrl = 'https://api.cloudinary.com/v1_1/dckua3qdp/video/upload';
    const cloudinaryPreset = 'calendar';

    // Fetch events on component mount
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:4000/events");
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const addEvent = async () => {
        if (!eventName) {
            toast.warn("Event name is required");
            return;
        }

        try {
            const mediaUrl = await uploadMedia(media); 
            await axios.post("http://localhost:4000/events", {
                title: eventName,
                date: date,
                mediaUrl: mediaUrl, 
            });
            fetchEvents();
            toast.success("Event added successfully!");
            setDisplay(false);
            setEventName(""); 
            setMedia(null); 
            setFileName(""); 
        } catch (error) {
            console.error("Error adding event:", error);
            toast.error("Failed to add event");
        }
    };

    const uploadMedia = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryPreset);

        const uploadUrl = file.type.includes('video') ? cloudinaryVideoUrl : cloudinaryUrl;
        
        try {
            const response = await axios.post(uploadUrl, formData, { headers: { "Content-Type": "multipart/form-data" } });
            return response.data.secure_url; 
        } catch (error) {
            console.error("Error uploading media:", error.response ? error.response.data : error.message);
            toast.error("Failed to upload media");
            return null;
        }
    };

    const removeEvent = async (eventId) => {
        try {
            await axios.delete(`http://localhost:4000/events/${eventId}`);
            fetchEvents();
            toast.success("Event removed successfully!");
            setDisplay(false);
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to remove event");
        }
    };

    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    const startingDayIndex = getDay(firstDayOfMonth);

    const handleMonthChange = (e) => {
        const newMonth = Number(e.target.value);
        const newDate = new Date(currentDate.getFullYear(), newMonth, 1);
        setCurrentDate(newDate);
    };

    const callPopup = (day) => {
        setDate(day);
        setDisplay(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setMedia(file); 
        setFileName(file ? file.name : ""); // Set the file name to be displayed
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <div className="mb-4">
                <h2 className="text-center font-bold text-3xl mb-6">{format(currentDate, "MMMM yyyy")}</h2>
                <div className="flex justify-center mb-4">
                    <select
                        className="border p-2 rounded-md text-black"
                        value={currentDate.getMonth()}
                        onChange={handleMonthChange}
                    >
                        {Array.from({ length: 12 }).map((_, monthIndex) => (
                            <option key={monthIndex} value={monthIndex}>
                                {format(new Date(currentDate.getFullYear(), monthIndex, 1), "MMMM")}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day) => (
                    <div key={day} className="font-bold text-center text-gray-700">{day}</div>
                ))}

                {Array.from({ length: startingDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="border rounded-md text-center p-4" />
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
                        {events.filter((event) => isSameDay(new Date(event.date), day)).map((event, i) => (
                            <div
                                key={`event-${i}`}
                                className="bg-green-500 rounded-md text-white mt-1 text-xs p-1 truncate"
                            >
                                {event.title}
                                {event.mediaUrl && (
                                    <div className="mt-1">
                                        {event.mediaUrl.endsWith('.mp4') ? (
                                            <video src={event.mediaUrl} className="w-full h-auto" controls />
                                        ) : (
                                            <img src={event.mediaUrl} alt="Event" className="w-full h-auto z-[1000]" />
                                        )}
                                    </div>
                                )}
                                <button
                                    className="text-xs ml-2 text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        removeEvent(event._id);
                                    }}
                                >
                                    ×
                                </button>
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
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                        <div className="mb-4">
                            <input
                                type="file"
                                accept="image/*,video/*"
                                className="w-full p-2"
                                onChange={handleFileChange}
                            />
                            {fileName && <p className="mt-2 text-sm text-gray-700">{fileName}</p>} {/* Display the file name */}
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                onClick={addEvent}
                            >
                                Add +
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                                onClick={() => setDisplay(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventCalendar;
