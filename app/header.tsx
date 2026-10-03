import Image from "next/image";
import Link from "next/link";
import { Icon } from "./ui-icon";
import { SITE_NAME } from "./seo";
import { SearchDialog } from "./search-dialog";

const TOP_CATEGORIES = [
  { name: "Action", slug: "action", icon: "bolt" },
  { name: "Racing", slug: "racing", icon: "car" },
  { name: "Puzzles", slug: "puzzles", icon: "puzzle" },
  { name: "2 Player", slug: "2-player", icon: "users4" },
  { name: "Arcade", slug: "arcade", icon: "joystick" },
  { name: "Shooting", slug: "shooting", icon: "target" },
  { name: "Sports", slug: "sports", icon: "ball" },
  { name: "3D", slug: "3d", icon: "cube" },
];

export function Header() {
  return (
    <header className="sticky top-2 z-40 w-full max-w-[1854px] mx-auto px-2.5 mb-2 sm:mb-3">
      <nav className="flex flex-col gap-2 rounded-2xl bg-white/95 backdrop-blur-md px-3 sm:px-5 py-2.5 shadow-[0_4px_20px_rgba(6,55,59,0.08)] border border-white/80 transition-all">
        {/* Top Row: Logo, Search Bar, Quick Links */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 shrink-0"
            aria-label={SITE_NAME}
          >
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-teal-50 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt={SITE_NAME}
                width={40}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#06373b] leading-tight">
                Tata<span className="text-[#009cff]">Gamer</span>
              </span>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest hidden md:block">
                10,000+ Free Games
              </span>
            </div>
          </Link>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-xl mx-auto">
            <SearchDialog variant="bar" />
          </div>

          {/* Right Action / Categories Quick Link */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/category/action"
              className="hidden lg:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#06373b] bg-teal-50/80 hover:bg-teal-500 hover:text-white transition-all shadow-xs"
            >
              <Icon name="bolt" className="h-3.5 w-3.5" />
              <span>Action</span>
            </Link>
            <Link
              href="/category/racing"
              className="hidden lg:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#06373b] bg-teal-50/80 hover:bg-teal-500 hover:text-white transition-all shadow-xs"
            >
              <Icon name="car" className="h-3.5 w-3.5" />
              <span>Racing</span>
            </Link>
            <Link
              href="/category/puzzles"
              className="hidden xl:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#06373b] bg-teal-50/80 hover:bg-teal-500 hover:text-white transition-all shadow-xs"
            >
              <Icon name="puzzle" className="h-3.5 w-3.5" />
              <span>Puzzles</span>
            </Link>

            <Link
              href="/#categories"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm"
              title="Explore all categories"
            >
              <Icon name="joystick" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All Games</span>
            </Link>
          </div>
        </div>

        {/* Bottom Category Scroll Strip (Visible on mobile & tablet) */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 border-t border-slate-100/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Top:
          </span>
          {TOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-teal-500 hover:text-white transition-all shrink-0 border border-slate-200/50"
            >
              <Icon name={cat.icon} className="h-3 w-3" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
