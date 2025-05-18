import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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

  const handleDownload = async () => {
    if (!componentRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      toast.loading("Generating PDF...", { id: "pdf-generation" });

      // Ensure the component is visible and has dimensions
      const cardElement = componentRef.current;
      const originalStyle = cardElement.style.cssText;
      cardElement.style.position = "absolute";
      cardElement.style.left = "-9999px";
      cardElement.style.top = "0";
      cardElement.style.width = "3.5in";
      cardElement.style.height = "2in";
      document.body.appendChild(cardElement);

      // Create a canvas from the component with improved settings
      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FDF6F0",
        logging: false,
        width: 336, // 3.5in * 96dpi
        height: 192, // 2in * 96dpi
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector("[data-card]") as HTMLElement;
          if (element) {
            element.style.width = "3.5in";
            element.style.height = "2in";
          }
        },
      });

      // Restore original element
      cardElement.style.cssText = originalStyle;
      document.body.removeChild(cardElement);

      // Create PDF with exact dimensions
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [3.5, 2],
        compress: true,
      });

      // Convert canvas to image with better quality settings
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0, 3.5, 2);

      // Generate filename
      const filename = `${event.title}-${guest.first_name}-${guest.last_name}.pdf`.replace(/[^a-z0-9]/gi, "_").toLowerCase();

      // Save the PDF
      pdf.save(filename);

      // Show success toast
      toast.dismiss("pdf-generation");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss("pdf-generation");
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="w-full flex justify-center bg-gradient-to-br from-[#FDF6F0] to-[#F5E6E0] p-12 rounded-xl shadow-lg">
        <div className="transform scale-90 origin-top" style={{ width: "3.5in", height: "2in" }}>
          <WeddingCard ref={componentRef} event={event} guest={guest} qrCodeUrl={qrCodeUrl} />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} className="border-[#D0C0B6] text-[#5F3922] hover:bg-[#F5E6E0]">
          Close
        </Button>
        <Button onClick={handleDownload} className="bg-[#D0C0B6] hover:bg-[#C0B0A6] text-[#5F3922]" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
};
