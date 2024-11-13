import {addDays,subDays} from "date-fns";
export const events=[
    {
        date:subDays(new Date(),6),
        title:"Coding Challenge",
    },
    {
        date:subDays(new Date(),1),
        title:"Post Video",
    },
    {
        date:addDays(new Date(),3),
        title:"Meetup in Delhi",
    }
]

export const WEEKDAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];