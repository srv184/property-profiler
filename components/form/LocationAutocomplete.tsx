"use client";

import { useEffect, useId, useState } from "react";
import { Plus } from "lucide-react";
import { LOCATION_SEED } from "@/data/locationSeed";

interface Props { disabled?: boolean; onAdd: (location: string) => void; }
const fallback = (query: string) => LOCATION_SEED.filter((location) => location.toLowerCase().includes(query.toLowerCase())).slice(0, 6);

export function LocationAutocomplete({ disabled, onAdd }: Props) {
  const [value, setValue] = useState(""); const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false); const [active, setActive] = useState(-1); const listId = useId();
  useEffect(() => {
    const query = value.trim(); if (query.length < 2) { setItems([]); setOpen(false); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try { const result = await fetch(`/api/locations?q=${encodeURIComponent(query)}`, { signal: controller.signal }); const data: { label: string }[] = await result.json(); const next = data.map((item) => item.label).filter(Boolean); setItems(next.length ? next : fallback(query)); }
      catch { if (!controller.signal.aborted) setItems(fallback(query)); }
      finally { if (!controller.signal.aborted) { setOpen(true); setActive(-1); } }
    }, 250);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [value]);
  const select = (location = value.trim()) => { if (!location) return; onAdd(location); setValue(""); setOpen(false); setActive(-1); };
  return <div className="relative mb-3 flex gap-2">
    <input type="text" value={value} disabled={disabled} placeholder="e.g. Coorg, Karnataka" aria-label="Add a location" role="combobox" aria-expanded={open} aria-controls={listId} aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowDown") { event.preventDefault(); setOpen(items.length > 0); setActive((current) => Math.min(current + 1, items.length - 1)); } else if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => Math.max(current - 1, 0)); } else if (event.key === "Enter") { event.preventDefault(); select(active >= 0 ? items[active] : undefined); } else if (event.key === "Escape") setOpen(false); }}
      className="focus-ring w-full rounded-xl border border-line bg-canvas-raised px-3.5 py-3 text-[15px] shadow-sm placeholder:text-ink-faint/70 disabled:cursor-not-allowed disabled:opacity-40" />
    <button type="button" onClick={() => select()} disabled={disabled || !value.trim()} className="focus-ring flex flex-shrink-0 items-center gap-1.5 rounded-xl border border-accent bg-accent px-3.5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-deep disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas-sunken disabled:text-ink-faint disabled:opacity-70"><Plus size={15} /> Add</button>
    {open && items.length > 0 && <ul id={listId} role="listbox" className="absolute left-0 right-14 top-full z-10 mt-1 max-h-52 overflow-auto rounded-xl border border-line bg-canvas-raised p-1.5 shadow-raised">{items.map((item, index) => <li key={item} id={`${listId}-${index}`} role="option" aria-selected={index === active} onMouseDown={(event) => { event.preventDefault(); select(item); }} className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm ${index === active ? "bg-orange-50 text-ink" : "text-ink-faint hover:bg-orange-50/60"}`}>{item}</li>)}</ul>}
  </div>;
}
