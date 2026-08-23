"use client";

import { useState } from "react";
import { Icon } from "../ui-icon";

export function ContactClient() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const email = "hello@tatagamer.com";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Big Hero Email */}
      <div className="relative group inline-flex items-center gap-3">
        <a
          href={`mailto:${email}`}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#06373b] hover:text-[#009cff] transition-colors tracking-tight select-all text-center"
        >
          {email}
        </a>
      </div>

      {/* Button to open Contact Form */}
      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-2 px-6 py-2.5 rounded-full bg-white text-[#06373b] font-bold text-xs shadow-md hover:bg-teal-50 transition cursor-pointer"
        >
          Send us a message directly &rarr;
        </button>
      ) : (
        <div className="w-full max-w-lg mt-4 bg-white rounded-[28px] p-6 sm:p-8 shadow-xl text-left border border-zinc-100 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-100">
            <h3 className="text-lg font-bold text-[#06373b]">Send Message</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <Icon name="close" className="w-5 h-5" />
            </button>
          </div>

          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <span className="text-xl font-bold">✓</span>
              </div>
              <h4 className="text-lg font-bold text-[#06373b]">Message Sent!</h4>
              <p className="text-xs text-zinc-500 mt-1">
                Thank you for reaching out. We will get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setShowForm(false);
                }}
                className="mt-6 px-5 py-2 rounded-full bg-[#009cff] text-white text-xs font-bold shadow hover:bg-sky-600 transition"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-[#06373b] focus:outline-none focus:ring-2 focus:ring-[#009cff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="yourname@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-[#06373b] focus:outline-none focus:ring-2 focus:ring-[#009cff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-[#06373b] focus:outline-none focus:ring-2 focus:ring-[#009cff]"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Game Support">Game Support / Bug Report</option>
                  <option value="Developer Partnership">Developer Partnership</option>
                  <option value="Press & Media">Press & Media</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-[#06373b] focus:outline-none focus:ring-2 focus:ring-[#009cff] resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl bg-[#009cff] text-white font-extrabold text-sm shadow-md hover:bg-sky-600 transition cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
