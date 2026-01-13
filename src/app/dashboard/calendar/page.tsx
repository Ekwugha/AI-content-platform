"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  parseISO,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  FileText,
  Share2,
  Mail,
  Megaphone,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalendarStore, CalendarEvent } from "@/store";
import { cn, generateId } from "@/lib/utils";

const typeIcons: Record<string, React.ReactNode> = {
  publish: <FileText className="h-3 w-3" />,
  review: <Check className="h-3 w-3" />,
  meeting: <CalendarIcon className="h-3 w-3" />,
  deadline: <Clock className="h-3 w-3" />,
};

const typeColors: Record<string, string> = {
  publish: "bg-emerald-500",
  review: "bg-blue-500",
  meeting: "bg-purple-500",
  deadline: "bg-amber-500",
};

// Initial mock events
const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Product Launch Post",
    date: format(new Date(Date.now() + 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    type: "publish",
    status: "pending",
  },
  {
    id: "2",
    title: "Weekly Newsletter",
    date: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    type: "publish",
    status: "pending",
  },
  {
    id: "3",
    title: "Content Review Meeting",
    date: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    type: "meeting",
    status: "pending",
  },
  {
    id: "4",
    title: "Campaign Deadline",
    date: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    type: "deadline",
    status: "pending",
  },
];

// Draggable Event Component
function DraggableEvent({ event }: { event: CalendarEvent }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group flex items-center gap-2 p-1.5 rounded-md text-xs cursor-grab active:cursor-grabbing transition-all",
        isDragging ? "opacity-50 shadow-lg scale-105" : "hover:bg-accent/50",
        event.status === "completed" && "opacity-60 line-through"
      )}
    >
      <div className={cn("w-2 h-2 rounded-full", typeColors[event.type])} />
      <span className="truncate flex-1">{event.title}</span>
    </div>
  );
}

// Calendar Day Cell
function CalendarDay({
  day,
  currentMonth,
  events,
  onAddEvent,
}: {
  day: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onAddEvent: (date: string) => void;
}) {
  const dateStr = format(day, "yyyy-MM-dd");
  const dayEvents = events.filter((e) => e.date === dateStr);
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const isCurrentDay = isToday(day);

  return (
    <SortableContext items={dayEvents.map((e) => e.id)} strategy={verticalListSortingStrategy}>
      <div
        className={cn(
          "min-h-[120px] p-2 border-r border-b transition-colors",
          !isCurrentMonth && "bg-muted/30",
          isCurrentDay && "bg-primary/5"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={cn(
              "text-sm font-medium w-7 h-7 rounded-full flex items-center justify-center",
              isCurrentDay && "bg-primary text-primary-foreground",
              !isCurrentMonth && "text-muted-foreground"
            )}
          >
            {format(day, "d")}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 h-6 w-6"
            onClick={() => onAddEvent(dateStr)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <DraggableEvent key={event.id} event={event} />
          ))}
          {dayEvents.length > 3 && (
            <span className="text-xs text-muted-foreground px-2">
              +{dayEvents.length - 3} more
            </span>
          )}
        </div>
      </div>
    </SortableContext>
  );
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    title: "",
    type: "publish" as CalendarEvent["type"],
  });
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const { events, setEvents, addEvent, moveEvent, deleteEvent } = useCalendarStore();

  // Initialize events
  React.useEffect(() => {
    if (events.length === 0) {
      setEvents(initialEvents);
    }
  }, [events.length, setEvents]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Pad the start with days from previous month
  const startDay = startOfMonth(currentMonth).getDay();
  const paddedDays = [...Array(startDay)].map((_, i) => {
    const date = new Date(startOfMonth(currentMonth));
    date.setDate(date.getDate() - (startDay - i));
    return date;
  });

  // Pad the end with days from next month
  const endDay = endOfMonth(currentMonth).getDay();
  const endPaddedDays = [...Array(6 - endDay)].map((_, i) => {
    const date = new Date(endOfMonth(currentMonth));
    date.setDate(date.getDate() + (i + 1));
    return date;
  });

  const allDays = [...paddedDays, ...days, ...endPaddedDays];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleAddEvent = (date: string) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleCreateEvent = () => {
    if (newEvent.title && selectedDate) {
      addEvent({
        id: generateId(),
        title: newEvent.title,
        date: selectedDate,
        type: newEvent.type,
        status: "pending",
      });
      setNewEvent({ title: "", type: "publish" });
      setIsDialogOpen(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const draggedEvent = events.find((e) => e.id === active.id);
      if (draggedEvent) {
        // Find the date the item was dropped on
        // This is a simplified version - in production you'd calculate the drop target date
        const overEvent = events.find((e) => e.id === over.id);
        if (overEvent) {
          moveEvent(active.id as string, overEvent.date);
        }
      }
    }
    setActiveId(null);
  };

  const activeEvent = activeId ? events.find((e) => e.id === activeId) : null;

  // Upcoming events for sidebar
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date() && e.status === "pending")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule your content with drag-and-drop.
          </p>
        </div>
        <Button variant="gradient" onClick={() => handleAddEvent(format(new Date(), "yyyy-MM-dd"))}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        {/* Calendar */}
        <GlassCard className="overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-7">
              {allDays.map((day) => (
                <div key={day.toISOString()} className="group">
                  <CalendarDay
                    day={day}
                    currentMonth={currentMonth}
                    events={events}
                    onAddEvent={handleAddEvent}
                  />
                </div>
              ))}
            </div>
            <DragOverlay>
              {activeEvent && (
                <div className="p-2 rounded-lg bg-background shadow-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <div className={cn("w-2 h-2 rounded-full", typeColors[activeEvent.type])} />
                    {activeEvent.title}
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </GlassCard>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <GlassCard>
            <h3 className="font-semibold mb-4">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  <div className={cn("w-3 h-3 rounded-full", color)} />
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Upcoming Events */}
          <GlassCard>
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className={cn("w-2 h-2 rounded-full mt-1.5", typeColors[event.type])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(event.date), "MMM d, yyyy")}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => deleteEvent(event.id)}>
                          <X className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events</p>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                placeholder="e.g., Blog post publish"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select
                value={newEvent.type}
                onValueChange={(v) => setNewEvent({ ...newEvent, type: v as CalendarEvent["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish">Publish</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={selectedDate || ""} readOnly />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleCreateEvent}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

