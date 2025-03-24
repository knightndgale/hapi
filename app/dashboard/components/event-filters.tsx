"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

export type EventStatus = "all" | "draft" | "published" | "archived";
export type EventType = "all" | "wedding" | "conference" | "party" | "other";

interface EventFiltersProps {
  onFilterChange: (filters: { type: EventType; status: EventStatus; dateRange: DateRange | undefined }) => void;
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [type, setType] = useState<EventType>("all");
  const [status, setStatus] = useState<EventStatus>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleTypeChange = (value: EventType) => {
    setType(value);
    onFilterChange({ type: value, status, dateRange });
  };

  const handleStatusChange = (value: EventStatus) => {
    setStatus(value);
    onFilterChange({ type, status: value, dateRange });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onFilterChange({ type, status, dateRange: range });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="wedding">Wedding</SelectItem>
          <SelectItem value="conference">Conference</SelectItem>
          <SelectItem value="party">Party</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={handleDateRangeChange} numberOfMonths={2} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
