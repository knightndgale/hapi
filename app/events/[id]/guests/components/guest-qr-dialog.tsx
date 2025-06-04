import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrintPreview } from "@/components/invitation-card/PrintPreview";
import { Guest } from "@/types/schema/Guest.schema";
import { ExtendedEvent } from "../../context/event-context";
import useDisclosure from "@/hooks/useDisclosure";

interface GuestQRDialogProps {
  event: ExtendedEvent | null;
  guest: Guest | null;
  token: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GuestQRDialog({ event, guest, token, isOpen, onClose }: GuestQRDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-1xl">
        <DialogHeader>
          <DialogTitle>Guest QR Code</DialogTitle>
        </DialogHeader>
        {event && guest && <PrintPreview event={event} guest={guest} qrCodeUrl={`${process.env.NEXT_PUBLIC_URL}/invite/validate/${token}`} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
