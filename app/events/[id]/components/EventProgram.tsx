import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import React from "react";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { programIcons } from "@/constants/program-icons";
import { useEvent } from "../context/event-context";

const EventProgram = () => {
  const { state } = useEvent();
  const { event } = state;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-xl font-semibold flex items-center gap-3 pb-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span>Program Schedule</span>
        </CardHeader>
        <CardContent>
          <div className="space-y-10">
            {event?.programs.map((item, index) => (
              <div key={index} className="relative flex gap-6 group">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  {item.programs_id &&
                  (typeof item.programs_id.icon === "string"
                    ? programIcons[item.programs_id.icon as keyof typeof programIcons]
                    : programIcons[item.programs_id.icon.name as keyof typeof programIcons]) ? (
                    React.createElement(
                      typeof item.programs_id.icon === "string"
                        ? programIcons[item.programs_id.icon as keyof typeof programIcons]
                        : programIcons[item.programs_id.icon.name as keyof typeof programIcons],
                      { className: "h-7 w-7 text-primary" }
                    )
                  ) : (
                    <Calendar className="h-7 w-7 text-primary" />
                  )}
                </div>

                <div className="flex-grow bg-white/60 rounded-xl p-6 shadow-sm transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="font-semibold text-xl text-primary">{item.programs_id.title}</h3>
                    <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-primary">{format(new Date(item.programs_id.dateTime), "h:mm a")}</p>
                    </div>
                  </div>

                  <p className="text-base mt-3 text-muted-foreground leading-relaxed">{item.programs_id.description}</p>

                  {item.programs_id.speaker && (
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <span className="text-primary">Speaker:</span>
                            {item.programs_id.speaker.name}
                          </p>
                          {item.programs_id.speaker.bio && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.programs_id.speaker.bio}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EventProgram;
