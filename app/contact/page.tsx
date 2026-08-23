import type { Metadata } from "next";
import Link from "next/link";
import { PokiFooter } from "../footer";
import { Icon } from "../ui-icon";
import { SITE_NAME } from "../seo";
import { ContactClient } from "./contact-client";

const OG_IMAGE = "/og-default.png";

export const metadata: Metadata = {
  title: `Contact Us — ${SITE_NAME}`,
  description:
    "We'd love to hear from you! Get in touch with the TataGamer team for support, developer publishing inquiries, press, or business partnerships.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact Us — ${SITE_NAME}`,
    description:
      "Get in touch with the TataGamer team for support, game publishing, press, or partnerships.",
    url: "/contact",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `Contact ${SITE_NAME}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact Us — ${SITE_NAME}`,
    description: "Get in touch with the TataGamer team for support, publishing inquiries, or press.",
    images: [OG_IMAGE],
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      {/* Top Header Bar */}
      <header className="py-4 flex items-center justify-between mb-4">
        {/* Signature Brand Tile */}
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

        {/* Top Right Social Links */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-extrabold tracking-wider uppercase text-[#06373b]">
            Follow us
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              <Icon name="tiktok" className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              <Icon name="instagram" className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              <Icon name="youtube" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-8 sm:py-12">
        {/* Hero Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-2xl font-extrabold text-[#06373b] tracking-tight mb-3">
            We&apos;d love to hear from you
          </h2>

          {/* Interactive Hero Email Display */}
          <ContactClient />
        </div>

        {/* 4 Info Bento Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Card 1 */}
          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#06373b]">
                Need quick help?
              </h3>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">
                Find answers to common questions about gameplay, saving progress, and safety.
              </p>
            </div>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#009cff] hover:underline"
            >
              <span>Check our FAQ</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#06373b]">
                Get into the game.
              </h3>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">
                Are you an independent developer or studio? Publish your HTML5 game on {SITE_NAME}.
              </p>
            </div>
            <Link
              href="/faq#partners-developers"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#009cff] hover:underline"
            >
              <span>Explore {SITE_NAME} for Developers</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#06373b]">
                Level up.
              </h3>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">
                Want to build the future of instant browser gaming with us?
              </p>
            </div>
            <Link
              href="/faq#partners-developers"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#009cff] hover:underline"
            >
              <span>Join our team</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-[#06373b]">
                Spread the word.
              </h3>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">
                For press kit requests, media inquiries, or brand sponsorship partnerships.
              </p>
            </div>
            <a
              href="mailto:press@tatagamer.com"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#009cff] hover:underline"
            >
              <span>Contact our press team</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        {/* Surprise Game CTA Bar */}
        <div className="text-center max-w-xl mx-auto py-10 px-6 rounded-[28px] bg-white/40 backdrop-blur-xs border border-white/40 shadow-sm">
          <h3 className="text-xl sm:text-2xl font-black text-[#06373b] mb-4">
            Ready for the next round?
          </h3>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#009cff] text-white font-extrabold text-sm shadow-lg hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Play a surprise game
          </Link>
        </div>
      </main>

      {/* Footer */}
      <PokiFooter />
    </div>
  );
}
