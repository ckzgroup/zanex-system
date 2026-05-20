import React from "react";
import ReactDatePicker from "react-datepicker";
import { cn } from "@/lib/utils"; // Utility for combining class names (optional)
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
    selected: Date | null;
    onChange: (date: Date | null) => void;
    placeholderText?: string;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   selected,
                                                   onChange,
                                                   placeholderText = "Select a date",
                                                   minDate,
                                                   maxDate,
                                                   className,
                                               }) => {
    return (
        <div className={cn("relative", className)}>
            <ReactDatePicker
                selected={selected}
                onChange={onChange}
                placeholderText={placeholderText}
                minDate={minDate}
                maxDate={maxDate}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                dateFormat="yyyy-MM-dd"
                showPopperArrow={false}
            />
        </div>
    );
};

export default DatePicker;
