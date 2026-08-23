"use client";

import { useState } from "react";
import { Icon } from "../ui-icon";

export function PrivacyClient() {
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [adCookies, setAdCookies] = useState(true);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const handleSavePreferences = () => {
    setSavedStatus("Your privacy preferences have been updated!");
    setTimeout(() => setSavedStatus(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Cookie Settings Box */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-md border border-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
          <div>
            <h2 className="text-lg font-extrabold text-[#06373b]">
              Cookie Preference Settings
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Control how cookies are stored on your device when playing games on TataGamer.
            </p>
          </div>
          {savedStatus && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in">
              {savedStatus}
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Essential Cookies */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div>
              <div className="text-sm sm:text-base font-bold text-[#06373b]">
                Essential Game & Site Cookies
              </div>
              <p className="text-sm sm:text-base text-zinc-500 mt-0.5">
                Required for saving your high scores, levels, volume settings, and website layout.
              </p>
            </div>
            <span className="text-xs font-black text-teal-600 px-3 py-1 rounded-full bg-teal-50 shrink-0">
              Always Active
            </span>
          </div>

          {/* Performance & Telemetry */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div>
              <div className="text-sm sm:text-base font-bold text-[#06373b]">
                Performance Telemetry & Analytics
              </div>
              <p className="text-sm sm:text-base text-zinc-500 mt-0.5">
                Helps us detect crashes and monitor server speed to keep game loading times fast.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={analyticsCookies}
                onChange={(e) => setAnalyticsCookies(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009cff]"></div>
            </label>
          </div>

          {/* Advertising Cookies */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
            <div>
              <div className="text-sm sm:text-base font-bold text-[#06373b]">
                Contextual & Advertising Cookies
              </div>
              <p className="text-sm sm:text-base text-zinc-500 mt-0.5">
                Allows non-intrusive ads that keep our games free for everyone.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={adCookies}
                onChange={(e) => setAdCookies(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009cff]"></div>
            </label>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-5 py-2.5 rounded-full bg-[#009cff] text-white text-sm font-extrabold shadow hover:bg-sky-600 transition cursor-pointer"
          >
            Save Cookie Preferences
          </button>
        </div>
      </div>

      {/* Local Version Info Box */}
      <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-md border border-zinc-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs sm:text-sm font-extrabold text-[#06373b] uppercase tracking-wider">
            Local Version & IP Location Notice
          </span>
        </div>
        <p className="text-base text-zinc-600 leading-relaxed">
          Your <strong>IP address</strong> allows our servers to deliver localized language settings and comply with regional privacy rules (such as GDPR in Europe or COPPA in the United States). All game content on TataGamer is delivered in English by default.
        </p>
      </div>
    </div>
  );
}
