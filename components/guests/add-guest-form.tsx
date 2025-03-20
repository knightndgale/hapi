"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddGuestFormProps {
  eventId: string;
  onSuccess: () => void;
}

export function AddGuestForm({ eventId, onSuccess }: AddGuestFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [guestType, setGuestType] = useState("regular");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement guest creation with the guest type
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guestType">Guest Type</Label>
        <Select value={guestType} onValueChange={setGuestType}>
          <SelectTrigger>
            <SelectValue placeholder="Select guest type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Regular Guest</SelectItem>
            <SelectItem value="entourage">Entourage</SelectItem>
            <SelectItem value="sponsor">Sponsor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email (Optional)</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <Button type="submit" className="w-full">
        Add Guest
      </Button>
    </form>
  );
}
