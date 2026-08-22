"use client";

import { useState } from "react";
import { Icon } from "../ui-icon";

export type QuestionItem = {
  q: string;
  a: string;
};

export type FAQCategory = {
  id: string;
  category: string;
  icon: string;
  questions: QuestionItem[];
};

export function FAQClient({ data }: { data: FAQCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(data[0].id);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "playing-games-0": true, // First question open by default
  });
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Search filter
  const filteredData = searchQuery.trim()
    ? data
        .map((cat) => ({
          ...cat,
          questions: cat.questions.filter(
            (item) =>
              item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.a.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) => cat.questions.length > 0)
    : data;

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input Bar */}
      <div className="max-w-xl mx-auto w-full mb-4">
        <div className="relative flex items-center">
          <Icon
            name="search"
            className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. sound, save, app, developers)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-full bg-white text-sm font-semibold text-[#06373b] placeholder-zinc-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#009cff] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 p-1 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Left Sticky Category Sidebar */}
        <aside className="w-full lg:w-72 lg:sticky lg:top-8 shrink-0 bg-white rounded-[24px] p-4 shadow-md">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 px-3 py-2">
            Categories
          </div>
          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {data.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-left whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#009cff] text-white shadow-md shadow-sky-200"
                      : "text-[#06373b] hover:bg-zinc-100"
                  }`}
                >
                  <Icon
                    name={cat.icon}
                    className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-teal-600"}`}
                  />
                  <span>{cat.category}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Section: Accordions Grouped by Category */}
        <div className="flex-1 w-full flex flex-col gap-10">
          {filteredData.length === 0 ? (
            <div className="bg-white rounded-[24px] p-12 text-center shadow-md">
              <Icon name="search" className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#06373b]">No matching questions found</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching with a different term like &ldquo;save&rdquo;, &ldquo;game&rdquo;, or &ldquo;privacy&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 rounded-full bg-[#009cff] text-white text-xs font-bold shadow hover:bg-sky-600 transition"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredData.map((cat) => (
              <section
                key={cat.id}
                id={cat.id}
                className="scroll-mt-8 bg-white rounded-[28px] p-6 sm:p-8 shadow-md transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                    <Icon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-[#06373b]">
                    {cat.category}
                  </h2>
                </div>

                {/* Questions List */}
                <div className="flex flex-col gap-3">
                  {cat.questions.map((item, idx) => {
                    const key = `${cat.id}-${idx}`;
                    const isOpen = Boolean(openItems[key]);

                    return (
                      <div
                        key={key}
                        className={`rounded-2xl border transition-all duration-200 ${
                          isOpen
                            ? "border-sky-200 bg-sky-50/40 shadow-sm"
                            : "border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/60"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between gap-4 p-4 text-left font-bold text-sm text-[#06373b] cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span>{item.q}</span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                              isOpen
                                ? "bg-[#009cff] text-white rotate-180"
                                : "bg-white text-zinc-400 shadow-xs"
                            }`}
                          >
                            <Icon name="chevronDown" className="w-4 h-4" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-base leading-relaxed text-zinc-600 border-t border-sky-100/60 animate-in fade-in duration-150">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
