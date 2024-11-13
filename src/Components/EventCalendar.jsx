import { eachDayOfInterval, endOfMonth, format, getDay, isSameDay, isToday, startOfMonth } from "date-fns";
import { WEEKDAYS } from "../utils/event";
import clsx from "clsx";



const EventCalendar=({events})=>{
    const currentDate=new Date();
    const firstDayOfMonth=startOfMonth(currentDate);
    const lastDayOfMonth=endOfMonth(currentDate);

    const daysInMonth=eachDayOfInterval(
        {
            start:firstDayOfMonth,
            end:lastDayOfMonth,
        }
    )

    

    const startingDayIndex=getDay(firstDayOfMonth);
    return(
        <div className="container mx-auto p-4">
            <div className="mb-4">
            <h2 className="text-center bg-red">{format(currentDate,"MMMM yyyy")}</h2>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((day)=>{
                    return <div key={day} className="font-bold text-center">{day}</div>
                })}

                {
                    Array.from({length:startingDayIndex}).map((_,i)=>{
                        return <div key={`empty-${i}`} className="border rounded-md text-center p-4"/>
                    })
                }
                {
                    daysInMonth.map((day,i)=>{
                        return <div key={`day-${i}`} className={clsx("border rounded-md text-center p-2",{
                            "bg-gray-200":isToday(day),
                            "text-gray-900":isToday(day),
                        })}>{format(day,"d")}
                        {events.filter((event)=>isSameDay(event.date,day))
                        .map((event,i)=>{
                            return <div key={`event-${i}`} className="bg-green-500 rounded-md text-gray-900 ">{event.title}</div>
                        })}
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default EventCalendar;