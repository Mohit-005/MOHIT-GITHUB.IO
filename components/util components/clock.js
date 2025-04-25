import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const Clock = ({ onlyTime, onlyDay }) => {
    const [displayTime, setDisplayTime] = useState('');
    const month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day_list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const updateTime = () => {
        const current_time = new Date();
        let day = day_list[current_time.getDay()];
        let hour = current_time.getHours();
        let minute = current_time.getMinutes();
        let month = month_list[current_time.getMonth()];
        let date = current_time.getDate().toLocaleString();
        let meridiem = (hour < 12 ? "AM" : "PM");

        if (minute.toLocaleString().length === 1) {
            minute = "0" + minute;
        }

        if (hour > 12) hour -= 12;

        let time;
        if (onlyTime) {
            time = hour + ":" + minute + " " + meridiem;
        }
        else if (onlyDay) {
            time = day + " " + month + " " + date;
        }
        else {
            time = day + " " + month + " " + date + " " + hour + ":" + minute + " " + meridiem;
        }
        setDisplayTime(time);
    };

    useEffect(() => {
        updateTime(); // Initial update
        const interval = setInterval(updateTime, 10 * 1000);
        return () => clearInterval(interval);
    }, [onlyTime, onlyDay]);

    return <span>{displayTime}</span>;
};

// Prevent server-side rendering for this component
export default dynamic(() => Promise.resolve(Clock), {
    ssr: false
});
