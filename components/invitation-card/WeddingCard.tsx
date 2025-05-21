import { forwardRef } from "react";
import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";
import { QRCodeCanvas } from "qrcode.react";

interface WeddingCardProps {
  event: Event;
  guest: Guest;
  qrCodeUrl: string;
}

export const WeddingCard = forwardRef<HTMLDivElement, WeddingCardProps>(({ event, guest, qrCodeUrl }, ref) => {
  console.log("🚀 ~ event:", event);
  return (
    <div
      ref={ref}
      data-card
      className="w-[2in] h-[3.5in] bg-white p-4 flex flex-col items-center justify-between relative overflow-hidden"
      style={{
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
      }}>
      {/* Event Logo/Title Section */}
      <div className="w-full text-center">{event.rsvp?.logo && <img src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${event.rsvp?.logo}`} alt="Logo" className="w-[100px] h-[100px]" />}</div>

      {/* Guest Name */}
      <div className="w-full text-center">
        <p className="text-black text-sm">
          {guest.first_name} {guest.last_name}
        </p>
      </div>

      {/* QR Code Section */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center">
        <div className="bg-white p-2 rounded-sm shadow-sm border border-gray-200 flex items-center justify-center">
          <QRCodeCanvas value={qrCodeUrl} size={100} level="H" className="w-[100px] h-[100px]" includeMargin={true} style={{ display: "block" }} />
        </div>
        <p className="text-black text-[8px] text-center mt-1">Please save this QR code in your phone</p>
      </div>

      {/* Event Details */}
      <div className="w-full space-y-1 text-center">
        <p className="text-black text-xs">
          {new Date(event.startDate).toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
        <p className="text-black text-xs italic">{event.location}</p>
      </div>

      {/* RSVP Deadline */}
      {event.rsvp?.deadline && (
        <div className="text-center">
          <p className="text-black text-xs italic">
            Kindly respond by{" "}
            {new Date(event.rsvp.deadline).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
});

WeddingCard.displayName = "WeddingCard";
