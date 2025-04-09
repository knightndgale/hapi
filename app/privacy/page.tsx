"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              At Hapi, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our event management platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Account information (name, email, password)</li>
              <li>Event information (titles, descriptions, dates, locations)</li>
              <li>Guest information (names, email addresses, RSVP responses)</li>
              <li>Content you upload (images, text)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Provide and maintain our services</li>
              <li>Process your event creation and management</li>
              <li>Send you important updates about your events</li>
              <li>Improve our platform and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@hapi.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
