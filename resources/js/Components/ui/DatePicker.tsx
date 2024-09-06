import * as React from "react"
import {Calendar as CalendarIcon} from "lucide-react"

import {cn} from "@/lib/utils"
import {PopoverContent, PopoverTrigger} from "./popover";
import {Popover} from "@radix-ui/react-popover";
import {format} from "date-fns";
import {Calendar} from "./calendar";
import {Button} from "./button";


export function DatePicker({onDateChange, value}: any) {
    const [date, setDate] = React.useState<Date>()
    const handleDateSelect = (selectedDate: any) => {
        setDate(selectedDate);
        onDateChange(selectedDate);
    };

    React.useEffect(() => {
        setDate(value);
    }, [value]);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="absolute w-auto  -translate-y-72   p-0 bg-gray-800 text-white z-50">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus

                />
            </PopoverContent>
        </Popover>

    )
}
