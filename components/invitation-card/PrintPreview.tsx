import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";
import { WeddingCard } from "./WeddingCard";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { Download, FileImage, Printer, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExtendedEvent } from "@/app/events/[id]/context/event-context";

interface PrintPreviewProps {
  event: ExtendedEvent;
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

  const handleDownloadImage = async () => {
    if (!componentRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(componentRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${event.title}-${guest.first_name}-${guest.last_name}.png`.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6  ">
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
      <TooltipProvider>
        <div className="flex justify-center">
          <div className="flex gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-900" aria-label="Close Preview">
                  <X className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close Preview</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handlePrint} variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800" disabled={isGenerating} aria-label="Download as PDF">
                  <Printer className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as PDF</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleDownloadImage} variant="ghost" size="icon" className="text-green-600 hover:text-green-800" disabled={isGenerating} aria-label="Download as Image">
                  <FileImage className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download as Image</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
