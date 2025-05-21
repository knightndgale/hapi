import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";
import { WeddingCard } from "./WeddingCard";
import { toast } from "sonner";

interface PrintPreviewProps {
  event: Event;
  guest: Guest;
  qrCodeUrl: string;
  onClose: () => void;
}

export const PrintPreview = ({ event, guest, qrCodeUrl, onClose }: PrintPreviewProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${event.title}-${guest.first_name}-${guest.last_name}`,

    onAfterPrint: () => {
      setIsGenerating(false);
      toast.dismiss("print-generation");
      toast.success("Document generated successfully!");
    },
    onPrintError: () => {
      setIsGenerating(false);
      toast.dismiss("print-generation");
      toast.error("Failed to generate document. Please try again.");
    },
    pageStyle: `
      @page {
        size: 2.5in 4in;
        margin: 0;
      }
      @media print {
        html, body {
          height: 100vh;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  }); // Type assertion needed due to type definition issues in the package

  return (
    <div className="flex flex-col space-y-6">
      <div className="w-full flex justify-center bg-white rounded-xl">
        <div
          ref={componentRef}
          className="transform scale-100 origin-top"
          style={{
            width: "2.5in",
            height: "4in",
            backgroundColor: "white",
          }}>
          <WeddingCard event={event} guest={guest} qrCodeUrl={qrCodeUrl} />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-700 hover:bg-gray-50">
          Close
        </Button>
        <Button onClick={handlePrint} className="bg-gray-900 hover:bg-gray-800 text-white" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
};
