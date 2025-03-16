export type Speaker = {
  name: string;
  bio?: string;
  image?: string;
}

export type ProgramItem = {
  title: string;
  description: string;
  dateTime: string;
  speaker: Speaker;
}

export type EventType = 'wedding' | 'birthday' | 'seminar';

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  templateId: string;
  media?: {
    type: 'video' | 'image';
    url: string;
  };
  program: ProgramItem[];
  attendees: number;
  maxAttendees: number;
}