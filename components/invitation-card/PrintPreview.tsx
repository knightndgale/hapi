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

      // Create a clone of the element for PDF generation
      const cardElement = componentRef.current;
      const clone = cardElement.cloneNode(true) as HTMLElement;

      // Set up the clone with proper dimensions and positioning
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = "2in";
      clone.style.height = "3.5in";
      clone.style.transform = "none";
      document.body.appendChild(clone);

      // Wait for QR code to render
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a canvas from the cloned component with higher quality settings
      const canvas = await html2canvas(clone, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        logging: false,
        width: 192,
        height: 336,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector("[data-card]") as HTMLElement;
          if (element) {
            element.style.width = "2in";
            element.style.height = "3.5in";
            element.style.transform = "none";
            element.style.padding = "0.25in";
          }

          // Ensure QR code is properly rendered
          const qrCode = clonedDoc.querySelector("canvas");
          if (qrCode) {
            qrCode.style.width = "100px";
            qrCode.style.height = "100px";
            qrCode.style.display = "block";
            qrCode.style.margin = "0 auto";
          }
        },
      });

      // Remove the clone after capture
      document.body.removeChild(clone);

      // Create PDF with exact dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [2, 3.5],
        compress: true,
      });

      // Convert canvas to image with better quality settings
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Add the image to the PDF
      pdf.addImage(imgData, "JPEG", 0, 0, 2, 3.5);

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
      <div className="w-full flex justify-center bg-white rounded-xl">
        <div className="transform scale-100 origin-top" style={{ width: "2in", height: "3.5in" }}>
          <WeddingCard ref={componentRef} event={event} guest={guest} qrCodeUrl={qrCodeUrl} />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-700 hover:bg-gray-50">
          Close
        </Button>
        <Button onClick={handleDownload} className="bg-gray-900 hover:bg-gray-800 text-white" disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </div>
    </div>
  );
};
