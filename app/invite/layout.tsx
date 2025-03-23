import { InviteProvider } from "./context/invite-context";
import { getEventData } from "@/actions/event.action";
import { getGuestData, submitRSVP } from "@/actions/guest.action";

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <InviteProvider
      actions={{
        getEventData,
        getGuestData,
        submitRSVP,
      }}>
      {children}
    </InviteProvider>
  );
}
