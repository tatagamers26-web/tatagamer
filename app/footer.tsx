import Link from "next/link";
import { Icon } from "./ui-icon";
import { SITE_NAME } from "./seo";

export function PokiFooter({ totalGames }: { totalGames?: number }) {
  return (
    <footer
      style={{ gridColumn: "1 / -1" }}
      className="relative w-full max-w-[1854px] mx-auto mt-10 pb-8"
    >
      {/* White Footer Container */}
      <div className="bg-white p-4 sm:p-10 md:p-12 border border-slate-100 rounded-[28px] sm:rounded-[32px] shadow-xl transition-all duration-300">
        {/* Top Feature Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-teal-50/60 border border-teal-100/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="bolt" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#06373b]">Instant Play</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium hidden xs:block">No downloads needed</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-100/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="sparkle" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#06373b]">100% Free</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium hidden xs:block">Unlimited gaming</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-sky-50/60 border border-sky-100/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#009cff] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="devices" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#06373b]">Multi-Device</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium hidden xs:block">Mobile & Desktop</div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-3.5 p-3 sm:p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/60">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="shieldCheck" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-extrabold text-[#06373b]">Safe & Secure</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium hidden xs:block">Curated content</div>
            </div>
          </div>
        </div>

        {/* Main Columns Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 font-bold">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="group inline-flex items-center">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-[#06373b] group-hover:text-teal-600 transition-colors">
                Tata<span className="text-orange-500">Gamer</span>
              </span>
            </Link>
            <p className="text-base font-medium text-slate-500 leading-relaxed">
              Your premier instant browser gaming destination. Enjoy hundreds of top-rated free games across all genres with no installations required.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
              >
                <Icon name="tiktok" className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
              >
                <Icon name="instagram" className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#06373b] text-white hover:bg-[#009cff] hover:scale-110 active:scale-95 transition-all shadow-sm"
              >
                <Icon name="youtube" className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: POPULAR CATEGORIES */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-400">
              POPULAR CATEGORIES
            </h3>
            <ul className="flex flex-col gap-2.5 text-base font-semibold text-[#06373b]">
              <li>
                <Link href="/?cat=Racing" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  Car Games
                </Link>
              </li>
              <li>
                <Link href="/?cat=.IO" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  .IO Games
                </Link>
              </li>
              <li>
                <Link href="/?cat=2%20Player" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  2 Player Games
                </Link>
              </li>
              <li>
                <Link href="/?cat=Puzzles" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Puzzle Games
                </Link>
              </li>
              <li>
                <Link href="/?cat=Girls" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                  Dress Up Games
                </Link>
              </li>
              <li>
                <Link href="/?cat=Shooting" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Shooting Games
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#009cff] transition-colors flex items-center gap-2.5 text-[#009cff] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#009cff]"></span>
                  Browse All Games &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP & SUPPORT */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-400">
              HELP & SUPPORT
            </h3>
            <ul className="flex flex-col gap-3 text-base font-semibold text-[#06373b]">
              <li>
                <Link href="/faq" className="hover:text-[#009cff] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#009cff] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#009cff] transition-colors">
                  Privacy Center & Cookies
                </Link>
              </li>
            </ul>
          </div>

            {/* Column 4: ABOUT TATAGAMER */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-slate-400">
              ABOUT TATAGAMER
            </h3>
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 flex flex-col gap-2.5 text-base font-medium text-slate-600 leading-relaxed">
              <p>
                {SITE_NAME} brings you an endless collection of instant browser games. Play high-octane racing, tactical puzzles, and multiplayer games seamlessly.
              </p>
              <p>
                Built for pure fun on mobile, tablet, and PC. No downloads, no waiting.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Footer Info line */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </div>
          {typeof totalGames === "number" && totalGames > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {totalGames.toLocaleString()} Free Games Online
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
