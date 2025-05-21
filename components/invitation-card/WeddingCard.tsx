import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";
import { QRCodeCanvas } from "qrcode.react";

interface WeddingCardProps {
  event: Event;
  guest: Guest;
  qrCodeUrl: string;
}

export const WeddingCard = ({ event, guest, qrCodeUrl }: WeddingCardProps) => {
  return (
    <div
      data-card
      className="w-[2.5in] h-[4in] bg-white py-[2.4rem] px-[2.5rem] flex flex-col items-center justify-between relative overflow-hidden"
      style={{
        pageBreakAfter: "always",
        pageBreakInside: "avoid",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}>
      {/* Background Image */}
      <img
        src="/images/wedding-template-1.jpg"
        alt="Wedding Template Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: "none", userSelect: "none" }}
        aria-hidden="true"
      />
      {/* Content Wrapper to ensure content is above background */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between">
        {/* Event Logo/Title Section */}
        <div className="w-full flex justify-center ">
          {event.rsvp?.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${event.rsvp?.logo}`}
              alt="Logo"
              className="w-[50px] h-[50px] object-contain"
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            />
          )}
        </div>

        {/* Guest Name */}
        <div className="w-full text-center">
          <p className="text-black text-[10px]">
            {guest.first_name} {guest.last_name}
          </p>
        </div>

        {/* QR Code Section */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center ">
          <div
            className="bg-white  rounded-sm shadow-sm border border-gray-200 flex items-center justify-center"
            style={{
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}>
            <QRCodeCanvas
              value={qrCodeUrl}
              size={130}
              level="H"
              className="w-[130px] h-[130px] "
              includeMargin={true}
              style={{
                display: "block",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              }}
            />
          </div>
          <p className="text-black text-[7px] text-center ">Please save this QR code in your phone</p>
        </div>

        {/* Event Details */}
        <div className="w-full  text-center ">
          <p className="text-black text-[8px] ">
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
          <p className="text-black text-[8px] font-bold italic">{event.location}</p>
        </div>

        {/* RSVP Deadline */}
        {event.rsvp?.deadline && (
          <div className="text-center">
            <p className="text-black text-[8px] italic">
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
    </div>
  );
};
