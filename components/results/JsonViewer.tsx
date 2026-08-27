"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { BuyerProfile } from "@/types/buyerProfile";

interface Props {
  profile: BuyerProfile;
}

/** Lightweight, dependency-free JSON syntax highlighter. */
function highlight(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-[#d8a869]"; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-[#b7b1a3]" : "text-[#9dc79a]";
      } else if (/true|false/.test(match)) {
        cls = "text-[#e0a48f]";
      } else if (/null/.test(match)) {
        cls = "text-[#8f897b]";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export function JsonViewer({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(profile, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — silently ignore, the JSON is still
      // fully visible and selectable on screen.
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-ink-faint">
          Complete canonical Buyer Profile — ready for a future recommendation
          engine.
        </p>
        <button
          type="button"
          onClick={handleCopy}
          className="focus-ring flex flex-shrink-0 items-center gap-1.5 rounded-full border border-line bg-canvas-raised px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-canvas-sunken"
        >
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy JSON
            </>
          )}
        </button>
      </div>
      <div className="no-scrollbar overflow-x-auto rounded-xl border border-line bg-[#1c1a17] p-4 sm:p-5">
        <pre className="min-w-max font-mono text-[12.5px] leading-relaxed text-[#e6e1d6]">
          <code
            dangerouslySetInnerHTML={{ __html: highlight(json) }}
          />
        </pre>
      </div>
    </div>
  );
}
