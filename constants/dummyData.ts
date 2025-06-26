import { Event } from "@/types/schema/Event.schema";

export const dummyEvent: Event = {
  guest_count: 10,
  created_by: "1",
  id: "1",
  title: "John & Jane's Wedding",
  description: "Join us in celebrating our special day!",
  startDate: new Date("2024-12-31"),
  endDate: new Date("2024-12-31"),
  startTime: "18:00",
  endTime: "18:00",
  location: "Grand Ballroom, Luxury Hotel",
  type: "wedding",
  templateId: "template-1",
  guests: [],
  maxAttendees: 100,
  status: "published",
  backgroundImage: "https://images.unsplash.com/photo-1535378146586-dad15573cb2e?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  pageBanner: "https://images.unsplash.com/photo-1545071677-f95c441049f1?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  sections: [
    {
      id: "1",
      section_id: "1",
      type: "content",
      title: "Our Love Story",
      description: `
        <p class="mb-4">In a world of endless possibilities, our paths crossed in the most unexpected way. What started as a chance encounter blossomed into a beautiful journey of love, trust, and understanding.</p>
        <p class="mb-4">Every moment we've shared has been a testament to the power of love and the beauty of finding your perfect match. From our first date to this moment, we've grown together, learned together, and built a foundation that will last a lifetime.</p>
        <p>We are excited to begin this new chapter of our lives together, surrounded by the love and support of our family and friends.</p>
      `,
    },
    {
      id: "2",
      section_id: "1",
      type: "image",
      title: "Our Journey Together",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    },
    {
      id: "3",
      section_id: "1",
      type: "content",
      title: "Wedding Details",
      description: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            <span>Ceremony at Grand Ballroom</span>
          </div>
          <div class="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>December 31, 2024</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>6:00 PM - 11:00 PM</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Luxury Hotel, City Center</span>
          </div>
        </div>
      `,
    },
    {
      id: "4",
      section_id: "1",
      type: "content",
      title: "What to Expect",
      description: `
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <Music className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Live Music & Entertainment</h3>
              <p>Enjoy an evening of beautiful melodies and entertainment that will make your celebration memorable.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Utensils className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Fine Dining Experience</h3>
              <p>Indulge in a carefully curated menu featuring the finest cuisine prepared by our expert chefs.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Camera className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Professional Photography</h3>
              <p>Capture every precious moment with our professional photography team.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Gift className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Wedding Favors</h3>
              <p>Take home a special token of our appreciation for being part of our special day.</p>
            </div>
          </div>
        </div>
      `,
    },
  ],
  programs: [
    {
      title: "Ceremony",
      description: "Wedding ceremony",
      dateTime: "2024-12-31T18:00",
      speaker: {
        name: "Reverend Smith",
        bio: "Our beloved pastor",
      },
      icon: "church",
    },
    {
      title: "Cocktail Hour",
      description: "Drinks and appetizers",
      dateTime: "2024-12-31T19:00",
      icon: "glasses",
    },
    {
      title: "Reception",
      description: "Dinner and celebration",
      dateTime: "2024-12-31T20:00",
      icon: "book",
    },
    {
      title: "First Dance",
      description: "Our special moment",
      dateTime: "2024-12-31T21:00",
      icon: "book",
    },
  ],
  theme: {
    primary: "#FF4081",
    secondary: "#2196F3",
    accent: "#FFC107",
    background: "#FFFFFF",
  },
};
