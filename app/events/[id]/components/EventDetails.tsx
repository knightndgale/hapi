import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

import React from "react";
import { useEvent } from "../context/event-context";
import { format } from "date-fns";

const EventDetails = () => {
  const { state } = useEvent();
  const { event } = state;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card data-testid="event-details-card" className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="text-xl font-semibold">Event Details</CardHeader>
        <CardContent className="space-y-6">
          {[
            { icon: Calendar, text: format(new Date(event?.startDate || ""), "MMMM d, yyyy") },
            { icon: Clock, text: format(new Date(`2000-01-01T${event?.startTime || ""}`), "h:mm a") },
            { icon: MapPin, text: event?.location || "" },
            { icon: Users, text: `${event?.guests.length || 0} / ${event?.maxAttendees || 0} Guests` },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors duration-300">
              <item.icon className="h-5 w-5 text-primary" />
              <span data-testid={`${item.icon}-text`} className="text-lg">
                {item.text}
              </span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventDetails;
