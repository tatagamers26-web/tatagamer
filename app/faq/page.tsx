import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PokiFooter } from "../footer";
import { Icon } from "../ui-icon";
import { SITE_NAME, siteUrl } from "../seo";
import { FAQClient } from "./faq-client";

const OG_IMAGE = "/og-default.png";

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${SITE_NAME}`,
  description:
    "Find clear answers to common questions about playing free browser games on TataGamer, device support, safety, privacy, ad-free options, and game publishing.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `Frequently Asked Questions - ${SITE_NAME}`,
    description:
      "Find clear answers to common questions about playing free browser games on TataGamer, device support, safety, privacy, ad-free options, and game publishing.",
    url: "/faq",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} FAQ` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Frequently Asked Questions - ${SITE_NAME}`,
    description: "Get answers to all your questions about playing games on TataGamer.",
    images: [OG_IMAGE],
  },
};

export const FAQ_DATA = [
  {
    id: "playing-games",
    category: "Playing Games",
    icon: "gamepad",
    questions: [
      {
        q: "How do I save or reset my game progress?",
        a: "Most HTML5 browser games on TataGamer automatically save your high scores, levels, and progress directly in your web browser's local storage (LocalStorage and IndexedDB). To ensure your progress is saved, avoid playing in Private/Incognito mode and do not clear your browser cookies or site data. If you want to reset your progress, simply clear your browser cookies for TataGamer or use the in-game settings menu if available.",
      },
      {
        q: "How do I play games on TataGamer?",
        a: "Playing games on TataGamer is instant and effortless! Simply browse our category grid or use the search bar to find any game you like, click on the game tile, and it will load directly inside your browser within seconds. No installations, downloads, plugins, or account sign-ups are required.",
      },
      {
        q: "How do I control the volume or mute game audio?",
        a: "Each game features an in-game audio toggle (usually represented by a speaker or gear icon) located on the main menu or corner overlay. Additionally, you can mute the entire browser tab by right-clicking the tab in Chrome, Firefox, Safari, or Edge and choosing 'Mute Tab'.",
      },
      {
        q: "How do I switch a game to Fullscreen mode?",
        a: "Underneath every game frame on TataGamer, you'll find an 'Expand / Fullscreen' button. Clicking this will expand the game canvas to fit your entire screen. Press the 'Esc' key on your keyboard or tap the screen exit button at any time to leave Fullscreen mode.",
      },
      {
        q: "What should I do if a game isn't loading or stutters?",
        a: "If a game gets stuck loading, try refreshing your browser page first (Ctrl + R or Cmd + R). If the issue persists, disable any aggressive ad-blockers or script-blocking browser extensions, as they can sometimes interfere with game assets. Also make sure hardware acceleration is enabled in your browser settings for smooth 60 FPS performance.",
      },
      {
        q: "Why is a game blocked at my school or workplace?",
        a: "Some school and corporate network administrators restrict access to gaming websites via firewall filters. If TataGamer is filtered on your network, we recommend contacting your network administrator or playing on a personal mobile network or home Wi-Fi.",
      },
    ],
  },
  {
    id: "safety-privacy",
    category: "Safety & Privacy",
    icon: "shieldCheck",
    questions: [
      {
        q: "Is TataGamer safe and family-friendly for kids?",
        a: "Yes! Safety is our top priority. All games published on TataGamer undergo strict manual screening and quality checks to ensure they are safe, free of malware, and free of malicious software. We curate family-appropriate titles and do not host unsafe or harmful content.",
      },
      {
        q: "Can I catch a virus or malware from playing on TataGamer?",
        a: "No. All games on TataGamer run in a secure, sandboxed web browser environment (HTML5 / WebAssembly). You never download or execute `.exe` or installation files on your computer or mobile device, eliminating the risk of virus infections.",
      },
      {
        q: "How does TataGamer protect user privacy and data?",
        a: "TataGamer does not require account creation, email registration, or personal identity details. We strictly comply with global privacy standards including COPPA and GDPR. We only collect non-identifiable technical telemetry (such as browser type and aggregate gameplay counts) to optimize website performance.",
      },
      {
        q: "Are there multiplayer chat features in games?",
        a: "Selected multiplayer games offer quick pre-set emoji reactions or automated quick-chat commands. Live open text chat is strictly moderated or disabled in family categories to prevent online harassment and protect young players.",
      },
      {
        q: "What should I do if I encounter an inappropriate game or bug?",
        a: "If you notice any bug, broken link, or inappropriate content in a game, please notify us immediately using the 'Contact Support' button at the bottom of this FAQ page or report it via our support email. Our team will review and address the report within 24 hours.",
      },
    ],
  },
  {
    id: "accounts",
    category: "Account & Features",
    icon: "userCircle",
    questions: [
      {
        q: "Do I need to sign up or create an account?",
        a: "No! You can play 100% of the games on TataGamer instantly without creating an account or giving any personal information.",
      },
      {
        q: "What are the benefits of no-registration gaming?",
        a: "No registration means instant access with zero friction! You don't have to remember passwords, deal with spam emails, or worry about account data leaks. Simply open the website and jump straight into playing.",
      },
      {
        q: "Can I bookmark or save my favorite games?",
        a: "Yes! You can bookmark any game page in your web browser (Ctrl + D on Windows, Cmd + D on Mac) or add TataGamer to your mobile phone home screen as a Progressive Web App (PWA) for one-tap access anytime.",
      },
    ],
  },
  {
    id: "apps-devices",
    category: "Apps & Devices",
    icon: "devices",
    questions: [
      {
        q: "Can I play TataGamer games on mobile phones and tablets?",
        a: "Absolutely! Over 95% of our game library is built with modern HTML5 technology, featuring touch controls optimized for iOS (iPhone/iPad), Android, Chromebooks, and tablets.",
      },
      {
        q: "Is there an official TataGamer app on Google Play or App Store?",
        a: "You don't need to download an app from an App Store! TataGamer is a high-performance Web App. On your phone's browser, tap 'Add to Home Screen' to install TataGamer directly as a lightweight app on your phone without using up storage space.",
      },
      {
        q: "Can I play games on TataGamer offline?",
        a: "Games require an initial internet connection to load their assets. However, once loaded, many single-player puzzle and arcade games will continue running smoothly even if your internet connection temporarily drops.",
      },
    ],
  },
  {
    id: "ads-experience",
    category: "Ads & Experience",
    icon: "adIcon",
    questions: [
      {
        q: "Why are there advertisements on TataGamer?",
        a: "Advertisements allow us to keep TataGamer 100% free for millions of players worldwide, as well as pay independent game developers fairly for their hard work. We work closely with certified ad networks to display clean, non-intrusive ads.",
      },
      {
        q: "Can I skip video ads in games?",
        a: "Yes. Most rewarded and pre-roll video ads feature a 'Skip Ad' button that appears after 3 to 5 seconds so you can get back to your gameplay as quickly as possible.",
      },
      {
        q: "Will an ad-blocker affect my gameplay experience?",
        a: "Some aggressive ad-blockers can accidentally block essential game scripts or save files, causing games to freeze or fail to load. If you experience loading issues, we recommend whitelist-granting TataGamer in your ad-blocker extension.",
      },
    ],
  },
  {
    id: "about-tatagamer",
    category: `About ${SITE_NAME}`,
    icon: "infoCircle",
    questions: [
      {
        q: `What is ${SITE_NAME}?`,
        a: `${SITE_NAME} is an online browser gaming platform offering thousands of instant-play HTML5 games across popular categories like Action, Racing, Puzzles, 2 Player, .IO, Strategy, and Hypercasual games.`,
      },
      {
        q: `Are all games on ${SITE_NAME} truly free?`,
        a: "Yes, 100% of our game catalog is completely free to play with no hidden paywalls, timed demos, or locked features.",
      },
      {
        q: "How often are new games added to the catalog?",
        a: `Our automated systems and curation team refresh the ${SITE_NAME} catalog regularly, adding fresh, trending, and top-rated games every week.`,
      },
      {
        q: "Who operates and builds TataGamer?",
        a: "TataGamer is built by a dedicated team of web engineers, game designers, and UX specialists passionate about making gaming accessible, fast, and fun for everyone around the globe.",
      },
    ],
  },
  {
    id: "partners-developers",
    category: "Partner & Developers",
    icon: "briefcase",
    questions: [
      {
        q: "I am a game developer - how can I publish my game on TataGamer?",
        a: "We love partnering with talented HTML5 game creators and studios! You can submit your game portfolio or HTML5 build to our developer partnership portal for review and monetization opportunities.",
      },
      {
        q: "I want to advertise my brand or product on TataGamer",
        a: "For brand sponsorships, custom ad placements, or programmatic advertising inquiries, reach out to our partnerships team via our contact form.",
      },
      {
        q: "Where can I submit job applications to work at TataGamer?",
        a: "Check out our Careers page or reach out to our team with your resume and portfolio. We're always looking for skilled developers, content creators, and game curators!",
      },
    ],
  },
];

export default function FAQPage() {
  // Generate valid FAQPage schema for Google Search & AdSense compliance
  const allQuestions = FAQ_DATA.flatMap((cat) => cat.questions);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="mx-auto w-full max-w-[1854px] px-2.5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Brand Header Navigation */}
      <header className="py-4 flex items-center justify-between border-b border-white/20 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-[var(--cell)] w-[var(--cell)] flex-col items-center justify-center gap-1.5 rounded-[20px] bg-white shadow-[0_6px_10px_rgba(6,55,59,0.18)]">
            <Link
              href="/"
              className="group flex flex-col items-center justify-center"
              aria-label={SITE_NAME}
            >
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={52}
                height={52}
                className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
            <Link
              href="/"
              aria-label="Home"
              className="grid h-7 w-7 place-items-center rounded-lg bg-zinc-100 text-teal-700 transition hover:bg-teal-100"
            >
              <Icon name="home" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-white text-[#06373b] font-bold text-xs shadow-md hover:bg-teal-50 transition-all hover:scale-105 active:scale-95"
          >
            Play Games &rarr;
          </Link>
        </nav>
      </header>

      {/* Main FAQ Content */}
      <main className="py-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white/70 text-teal-900 font-bold text-xs uppercase tracking-wider mb-3">
            Help Center & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#06373b] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-teal-950/80 font-medium">
            Everything you need to know about playing games, device compatibility, privacy, safety, and publishing on {SITE_NAME}.
          </p>
        </div>

        {/* Interactive Client FAQ Layout */}
        <FAQClient data={FAQ_DATA} />

        {/* Bottom Contact CTA Box */}
        <section className="mt-14 max-w-3xl mx-auto rounded-[28px] bg-white p-8 sm:p-10 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-[#06373b]">
            Didn&apos;t find what you were looking for?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 max-w-lg mx-auto">
            Our support team is always happy to help with game issues, account questions, or developer partner inquiries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@tatagamer.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#009cff] text-white font-bold text-sm shadow-md hover:bg-sky-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Contact Support</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 text-[#06373b] font-bold text-sm hover:bg-zinc-200 transition cursor-pointer"
            >
              Back to Games
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <PokiFooter />
    </div>
  );
}
