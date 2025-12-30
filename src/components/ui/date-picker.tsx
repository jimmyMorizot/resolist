"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Sélectionner une date",
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3 whitespace-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate ml-2">
            {date ? format(date, "d MMM yyyy", { locale: fr }) : placeholder}
          </span>
          {date && (
            <X
              className="ml-auto h-4 w-4 opacity-50 hover:opacity-100 flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onDateChange(undefined)
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          locale={fr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
