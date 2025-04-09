"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Hapi?",
      answer: "Hapi is an event management platform that helps you create, manage, and share beautiful event pages and invitations.",
    },
    {
      question: "How do I create an event?",
      answer:
        "To create an event, simply log in to your dashboard and click the 'Create Event' button. Follow the step-by-step process to set up your event details, choose a template, and customize your event page.",
    },
    {
      question: "Can I customize my event page?",
      answer: "Yes! You can customize your event page by adding images, text, and changing the background. You can also rearrange content using our drag-and-drop interface.",
    },
    {
      question: "How do I manage RSVPs?",
      answer: "Once you create an event, you can send invitations to your guests. They can RSVP through the event page, and you can track responses in your dashboard.",
    },
    {
      question: "What happens if I need to cancel an event?",
      answer: "You can archive any event at any time. Once archived, the event page will show an 'Event Cancelled' message and guests won't be able to RSVP.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="faq-page">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  );
}
