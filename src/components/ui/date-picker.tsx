"use client"

import { useState } from "react"
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
  const [open, setOpen] = useState(false)

  const handleClearDate = () => {
    onDateChange(undefined)
  }

  const handleSelectDate = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate)
    setOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10 px-3 whitespace-normal gap-2",
              !date && "text-muted-foreground",
              date && "pr-10"
            )}
          >
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 truncate">
              {date ? format(date, "d MMM yyyy", { locale: fr }) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-900" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
            locale={fr}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {date && (
        <button
          type="button"
          onClick={handleClearDate}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
