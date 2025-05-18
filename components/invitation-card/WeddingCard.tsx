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
  return (
    <div
      ref={ref}
      data-card
      className="w-[3.5in] h-[2in] bg-gradient-to-br from-[#FDF6F0] to-[#F5E6E0] p-5 flex items-center justify-between relative overflow-hidden"
      style={{
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
      }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/patterns/subtle-pattern.png')] opacity-5" />

      {/* Floral corner decorations */}
      <div className="absolute top-0 left-0 w-12 h-12 opacity-10">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#5F3922" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-12 h-12 opacity-10 transform rotate-90">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#5F3922" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-12 h-12 opacity-10 transform -rotate-90">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#5F3922" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-12 h-12 opacity-10 transform rotate-180">
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#5F3922" />
        </svg>
      </div>

      {/* Main content */}
      <div className="flex-1 pr-4 relative z-10">
        <div className="text-center mb-3">
          <h1 className="text-[#5F3922] text-xl font-serif font-bold tracking-wider mb-2">{event.title}</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D0C0B6] to-transparent mx-auto" />
        </div>

        <div className="text-center mb-4">
          <p className="text-[#896148] text-sm font-serif tracking-wide">
            {guest.first_name} {guest.last_name}
          </p>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-[#71684B] text-xs font-serif tracking-wide">
            {new Date(event.startDate).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-[#71684B] text-xs font-serif tracking-wide">at {event.startTime}</p>
          <p className="text-[#71684B] text-xs font-serif italic tracking-wide">{event.location}</p>
        </div>

        {event.rsvp?.deadline && (
          <div className="mt-3 text-center">
            <p className="text-[#5F3922] text-xs font-serif italic tracking-wide">
              Kindly respond by{" "}
              {new Date(event.rsvp.deadline).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* QR Code section */}
      <div className="flex-shrink-0 relative z-10">
        <div className="bg-white p-2 rounded-sm shadow-md border border-[#D0C0B6]">
          <QRCodeCanvas value={qrCodeUrl} size={85} level="H" className="w-[85px] h-[85px]" />
        </div>
        <p className="text-[#5F3922] text-[8px] text-center mt-1.5 font-serif tracking-wide">Scan to RSVP</p>
      </div>
    </div>
  );
});

WeddingCard.displayName = "WeddingCard";
