import type { Metadata } from "next";
import Link from "next/link";
import { PokiFooter } from "../footer";
import { Icon } from "../ui-icon";
import { SITE_NAME } from "../seo";
import { PrivacyClient } from "./privacy-client";

const OG_IMAGE = "/og-default.png";

export const metadata: Metadata = {
  title: `Privacy Center & Policy — ${SITE_NAME}`,
  description:
    "Learn about how TataGamer protects your privacy, uses cookies, complies with COPPA, GDPR, and CCPA, and manages non-personal technical telemetry.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy Center & Policy — ${SITE_NAME}`,
    description:
      "Learn about how TataGamer protects your privacy, uses cookies, complies with COPPA, GDPR, and CCPA.",
    url: "/privacy",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} Privacy Policy` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Center & Policy — ${SITE_NAME}`,
    description: "Your privacy is important to us. Learn how TataGamer keeps your data safe.",
    images: [OG_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      {/* Header Bar */}
      <header className="py-4 flex items-center justify-between mb-4">
        {/* Brand Tile & Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-[var(--cell)] w-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
            <Link
              href="/"
              className="text-[13px] font-black leading-none tracking-tight text-teal-600"
            >
              Tata<span className="text-orange-500">Gamer</span>
            </Link>
            <Link
              href="/"
              aria-label="Home"
              className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
            >
              <Icon name="home" className="h-4 w-4" />
            </Link>
          </div>
          <span className="text-lg font-black text-[#06373b] tracking-tight">
            Privacy Center
          </span>
        </div>

        {/* Top Right Exit Link */}
        <Link
          href="/"
          className="px-4 py-2 rounded-full bg-white text-[#06373b] font-bold text-xs shadow-sm hover:bg-teal-50 transition flex items-center gap-1.5"
        >
          <span>Exit</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="py-6 sm:py-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#06373b] tracking-tight">
            Everything you need to know about privacy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 leading-relaxed font-medium">
            It&apos;s important for you to know how online privacy works. That&apos;s why we make it easy to understand what happens with the information we collect from you. Start exploring and learn what you need.
          </p>
        </div>

        {/* 4 Feature Bento Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {/* Card 1 */}
          <a
            href="#data-usage"
            className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="floppy" className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-[#06373b] group-hover:text-[#009cff] transition-colors">
              Why we use your data
            </h2>
          </a>

          {/* Card 2 */}
          <a
            href="#cookies-policy"
            className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="cookie" className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-[#06373b] group-hover:text-[#009cff] transition-colors">
              How we use cookies
            </h2>
          </a>

          {/* Card 3 */}
          <a
            href="#privacy-rights"
            className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="scales" className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-[#06373b] group-hover:text-[#009cff] transition-colors">
              Your privacy rights
            </h2>
          </a>

          {/* Card 4 */}
          <a
            href="#website-rules"
            className="bg-white rounded-[28px] p-6 shadow-md hover:shadow-lg transition-all text-center flex flex-col items-center justify-center gap-3 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon name="book" className="w-7 h-7" />
            </div>
            <h2 className="text-base font-extrabold text-[#06373b] group-hover:text-[#009cff] transition-colors">
              Our website rules
            </h2>
          </a>
        </div>

        {/* Interactive Privacy & Cookie Controls */}
        <PrivacyClient />

        {/* Detailed Legal Privacy Policy Document (Google AdSense & Search Compliant) */}
        <article className="max-w-4xl mx-auto mt-14 bg-white rounded-[32px] p-8 sm:p-12 shadow-lg text-[#06373b] leading-relaxed">
          <header className="border-b border-zinc-100 pb-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Official Privacy Policy
            </h2>
            <p className="text-xs font-bold text-zinc-400 mt-2">
              Last Updated: August 2026 &bull; Effective Immediately
            </p>
          </header>

          <div className="space-y-8 text-sm sm:text-base text-zinc-700">
            {/* Section 1 */}
            <section id="introduction">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                1. Introduction & Overview
              </h3>
              <p>
                Welcome to <strong>{SITE_NAME}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to safeguarding the privacy of our visitors while providing a safe, instant, and fun online gaming platform. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website at <code>tatagamer.com</code> and play our HTML5 games.
              </p>
              <p className="mt-2">
                By accessing or using {SITE_NAME}, you agree to the practices described in this Privacy Policy. If you do not agree with this policy, please discontinue use of our site.
              </p>
            </section>

            {/* Section 2 */}
            <section id="data-usage">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                2. Information We Collect
              </h3>
              <p>
                {SITE_NAME} operates as an instant-play platform that does <strong>not require user account creation, email registration, or passwords</strong>. As a result, we do not collect personal identification numbers, real names, physical addresses, or financial payment details.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-zinc-600">
                <li>
                  <strong>Technical Device Telemetry:</strong> We automatically collect standard non-identifiable technical information such as your IP address, browser type, operating system, language preferences, device type (mobile, tablet, desktop), and referring URLs.
                </li>
                <li>
                  <strong>Local Gameplay Storage:</strong> High scores, game level progress, unlocked items, and user preferences are stored locally on your device via browser LocalStorage and IndexedDB.
                </li>
                <li>
                  <strong>Aggregate Usage Analytics:</strong> We measure page views, total game plays, session duration, and crash reports to improve website performance and user experience.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="cookies-policy">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                3. Cookies & Tracking Technologies
              </h3>
              <p>
                Cookies are small text files placed on your computer or mobile device by websites that you visit. We use cookies and similar browser storage technologies to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-zinc-600">
                <li>Remember your game state and volume settings across sessions.</li>
                <li>Analyze aggregate web traffic patterns to optimize server speed.</li>
                <li>Serve contextual, clean, and non-intrusive advertisements.</li>
              </ul>
              <p className="mt-3">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, disabling cookies may prevent your game progress from being saved automatically.
              </p>
            </section>

            {/* Section 4 - AdSense Disclosure */}
            <section id="adsense-disclosure" className="bg-sky-50/60 rounded-2xl p-6 border border-sky-100">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                4. Third-Party Advertising & Google AdSense Disclosures
              </h3>
              <p>
                To keep {SITE_NAME} 100% free for all players, we partner with third-party advertising networks, including <strong>Google AdSense</strong> and certified programmatic partners.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-600 text-sm">
                <li>
                  Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the internet.
                </li>
                <li>
                  Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
                </li>
                <li>
                  Users may opt out of personalized advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#009cff] font-bold underline"
                  >
                    Google Ads Settings
                  </a>.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="coppa">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                5. Children&apos;s Online Privacy Protection (COPPA Compliance)
              </h3>
              <p>
                Protecting young players is fundamental to our platform design. {SITE_NAME} complies with the Children&apos;s Online Privacy Protection Act (COPPA).
              </p>
              <p className="mt-2">
                We do not knowingly collect personal information from children under 13 years of age. In our family and kids game sections, behavioral advertising targeting is disabled, ensuring that only contextual ads appropriate for general audiences are displayed. If a parent or guardian believes that personal data has been inadvertently collected, please contact us immediately for prompt removal.
              </p>
            </section>

            {/* Section 6 */}
            <section id="privacy-rights">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                6. Your Privacy Rights (GDPR & CCPA)
              </h3>
              <p>
                Depending on your geographic location, you have statutory rights regarding your personal data under the European General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-zinc-600">
                <li><strong>Right to Access:</strong> You have the right to request information about what non-identifiable telemetry data is collected.</li>
                <li><strong>Right to Erasure (Forget Me):</strong> You can clear your LocalStorage cookies at any time to delete all stored progress data.</li>
                <li><strong>Right to Opt-Out:</strong> You can reject non-essential cookies using our cookie preference banner.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="website-rules">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                7. Website Rules & Security
              </h3>
              <p>
                All games hosted on {SITE_NAME} run in a secure, sandboxed HTML5 iframe environment. Users are prohibited from attempting to reverse-engineer, inject malicious scripts, or scrape platform assets.
              </p>
            </section>

            {/* Section 8 */}
            <section id="contact-privacy">
              <h3 className="text-lg font-bold text-[#06373b] mb-2">
                8. Contact Information & Data Protection Officer
              </h3>
              <p>
                If you have questions, comments, or data erasure requests concerning this Privacy Policy, please contact our privacy compliance team:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <Icon name="pencil" className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-zinc-400 uppercase">Email Us</div>
                  <a href="mailto:privacy@tatagamer.com" className="text-xs font-bold text-[#009cff] hover:underline">
                    privacy@tatagamer.com
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <Icon name="phone" className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-zinc-400 uppercase">Call Support</div>
                  <div className="text-xs font-bold text-[#06373b]">+1 (800) 555-GAME</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <Icon name="mapPin" className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-zinc-400 uppercase">Global Office</div>
                  <div className="text-xs font-bold text-[#06373b]">TataGamer Inc. Privacy Team</div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>

      {/* Footer */}
      <PokiFooter />
    </div>
  );
}
