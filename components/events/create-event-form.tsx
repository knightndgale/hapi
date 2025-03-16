"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
import { ProgramItem, EventType, EventTemplate } from "@/types/event"
import { cn } from "@/lib/utils"

const eventTemplates: EventTemplate[] = [
  {
    id: "wedding-classic",
    name: "Classic Romance",
    type: "wedding",
    description: "Elegant and timeless design with soft colors and floral elements",
    preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#FF92A5",
      secondary: "#FFF0F3",
      accent: "#FFB7C5",
      background: "#FFFFFF"
    }
  },
  {
    id: "wedding-modern",
    name: "Modern Minimalist",
    type: "wedding",
    description: "Clean and contemporary design with minimalist aesthetics",
    preview: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#2C3E50",
      secondary: "#ECF0F1",
      accent: "#BDC3C7",
      background: "#FFFFFF"
    }
  },
  {
    id: "birthday-fun",
    name: "Fun Celebration",
    type: "birthday",
    description: "Vibrant and playful design with festive elements",
    preview: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#FF6B6B",
      secondary: "#4ECDC4",
      accent: "#FFE66D",
      background: "#FFFFFF"
    }
  },
  {
    id: "birthday-elegant",
    name: "Elegant Birthday",
    type: "birthday",
    description: "Sophisticated design with a touch of glamour",
    preview: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#845EC2",
      secondary: "#D65DB1",
      accent: "#FF9671",
      background: "#FFFFFF"
    }
  },
  {
    id: "seminar-professional",
    name: "Professional Conference",
    type: "seminar",
    description: "Clean and professional design for business events",
    preview: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#2C3E50",
      secondary: "#34495E",
      accent: "#3498DB",
      background: "#FFFFFF"
    }
  },
  {
    id: "seminar-tech",
    name: "Tech Summit",
    type: "seminar",
    description: "Modern and dynamic design for tech events",
    preview: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    theme: {
      primary: "#6C5CE7",
      secondary: "#A3CB38",
      accent: "#FDA7DF",
      background: "#FFFFFF"
    }
  }
]

export function CreateEventForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [mediaType, setMediaType] = useState<"video" | "image">("image")
  const [mediaUrl, setMediaUrl] = useState("")
  const [maxAttendees, setMaxAttendees] = useState<number>(100)
  const [program, setProgram] = useState<ProgramItem[]>([])
  const [eventType, setEventType] = useState<EventType>("wedding")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  const handleAddProgramItem = () => {
    setProgram([
      ...program,
      {
        title: "",
        description: "",
        dateTime: "",
        speaker: {
          name: "",
          bio: "",
        },
      },
    ])
  }

  const handleUpdateProgramItem = (index: number, field: keyof ProgramItem | keyof Speaker, value: string) => {
    const updatedProgram = [...program]
    if (field === "name" || field === "bio") {
      updatedProgram[index].speaker = {
        ...updatedProgram[index].speaker,
        [field]: value,
      }
    } else {
      updatedProgram[index] = {
        ...updatedProgram[index],
        [field]: value,
      }
    }
    setProgram(updatedProgram)
  }

  const handleRemoveProgramItem = (index: number) => {
    setProgram(program.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    const eventData = {
      title,
      description,
      date,
      time,
      location,
      maxAttendees,
      type: eventType,
      templateId: selectedTemplate,
      media: {
        type: mediaType,
        url: mediaUrl,
      },
      program,
    }
    console.log(eventData)
  }

  const filteredTemplates = eventTemplates.filter(template => template.type === eventType)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="eventType">Event Type</Label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => {
              setEventType(e.target.value as EventType)
              setSelectedTemplate("")
            }}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="seminar">Seminar</option>
          </select>
        </div>

        <div className="space-y-4">
          <Label>Select Template</Label>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={cn(
                  "relative cursor-pointer rounded-lg overflow-hidden transition-all",
                  selectedTemplate === template.id
                    ? "ring-2 ring-primary"
                    : "hover:ring-2 hover:ring-primary/50"
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-200">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter event description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter event location"
            required
          />
        </div>

        <div>
          <Label htmlFor="maxAttendees">Maximum Attendees</Label>
          <Input
            id="maxAttendees"
            type="number"
            min="1"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(parseInt(e.target.value))}
            placeholder="Enter maximum number of attendees"
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Media</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mediaType">Type</Label>
              <select
                id="mediaType"
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as "video" | "image")}
                className="w-full p-2 border rounded-md"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <Label htmlFor="mediaUrl">URL</Label>
              <Input
                id="mediaUrl"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Enter media URL"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Program</Label>
            <Button type="button" variant="outline" onClick={handleAddProgramItem}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          {program.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">Program Item {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProgramItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => handleUpdateProgramItem(index, "title", e.target.value)}
                      placeholder="Enter session title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={item.description}
                      onChange={(e) => handleUpdateProgramItem(index, "description", e.target.value)}
                      placeholder="Enter session description"
                    />
                  </div>
                  <div>
                    <Label>Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={item.dateTime}
                      onChange={(e) => handleUpdateProgramItem(index, "dateTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label>Speaker</Label>
                    <Input
                      value={item.speaker.name}
                      onChange={(e) => handleUpdateProgramItem(index, "name", e.target.value)}
                      placeholder="Speaker name"
                    />
                    <Textarea
                      value={item.speaker.bio}
                      onChange={(e) => handleUpdateProgramItem(index, "bio", e.target.value)}
                      placeholder="Speaker bio"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Event
      </Button>
    </form>
  )
}