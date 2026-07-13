"use client";

import { useState } from "react";
import { INDUSTRY_CATALOG } from "../data/industryWorkflows";

type Industry = {
  icon: string;
  name: string;
  desc: string;
  key: string;
  waText: string;
};

const ICONS: Record<string, JSX.Element> = {
  home: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  chat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  mail: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  trending: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  target: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  cart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>,
  dollar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  doc: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  megaphone: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>,
  video: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bar: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  bot: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  lock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  plane: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 19-7z"/></svg>,
};

function Modal({ industry, onClose }: { industry: Industry; onClose: () => void }) {
  const data = INDUSTRY_CATALOG[industry.key];
  if (!data) return null;

  const waHref = `https://wa.me/5491172373729?text=${encodeURIComponent(industry.waText)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background: "#1d1d1f", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-7 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <span className="mb-3 block" style={{ color: "#2997ff" }}>{ICONS[industry.icon] ?? null}</span>
            <h2 className="headline-sm mb-1">{industry.name}</h2>
            <p className="text-sm" style={{ color: "#86868b" }}>
              {data.count}+ automatizaciones disponibles · {industry.desc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none mt-1 hover:opacity-70 transition-opacity"
            style={{ color: "#86868b" }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Workflow list */}
        <div className="overflow-y-auto flex-1 p-4">
          <ul className="flex flex-col gap-2">
            {data.workflows.map((wf, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl px-4 py-3"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-xs font-mono mt-0.5 shrink-0" style={{ color: "#2997ff" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: "#f5f5f7" }}>{wf.name}</p>
                  {wf.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {wf.tags.split(" · ").map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(41,151,255,0.08)", color: "#6e9fd4" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="p-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center rounded-full py-3.5 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#2997ff", color: "#fff" }}
          >
            Quiero automatizar mi {industry.name.toLowerCase()} →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function IndustryGrid({ industries }: { industries: Industry[] }) {
  const [selected, setSelected] = useState<Industry | null>(null);

  return (
    <>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        {industries.map((ind) => (
          <button
            key={ind.name}
            onClick={() => setSelected(ind)}
            className="flex flex-col gap-3 p-6 text-center items-center transition-all hover:bg-white/5 cursor-pointer group"
            style={{ background: "#1d1d1f" }}
          >
            <span className="transition-colors" style={{ color: "#86868b" }}>
              {ICONS[ind.icon] ?? null}
            </span>
            <span className="text-sm font-semibold" style={{ color: "#f5f5f7" }}>{ind.name}</span>
            <span className="text-xs leading-snug" style={{ color: "#86868b" }}>{ind.desc}</span>
            <span className="text-xs mt-auto" style={{ color: "#2997ff" }}>
              Ver qué se puede automatizar →
            </span>
          </button>
        ))}
      </div>

      {selected && <Modal industry={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
