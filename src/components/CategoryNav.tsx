"use client";

import { useEffect, useRef, useState } from "react";

type Cat = { id: string; name: string };

export function CategoryNav({ categories }: { categories: Cat[] }) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const navRef = useRef<HTMLDivElement>(null);

  // Highlight the last category whose heading has scrolled under the sticky bar.
  useEffect(() => {
    function onScroll() {
      const offset = 140; // sticky header (~60) + category bar (~50) + margin
      let current = categories[0]?.id ?? "";
      for (const c of categories) {
        const el = document.getElementById(`category-${c.id}`);
        if (el && el.getBoundingClientRect().top <= offset) current = c.id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories]);

  // Keep the active chip centered within the bar — scroll ONLY the bar
  // horizontally (scrollIntoView would also scroll the page vertically).
  useEffect(() => {
    const nav = navRef.current;
    const chip = nav?.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (nav && chip) {
      const target =
        chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2;
      nav.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [active]);

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault();
    const el = document.getElementById(`category-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  }

  if (categories.length < 2) return null;

  return (
    <div
      ref={navRef}
      className="sticky top-[60px] z-[9] -mx-4 mb-8 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur"
    >
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#category-${c.id}`}
          data-cat={c.id}
          onClick={(e) => handleClick(e, c.id)}
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
            active === c.id
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted hover:text-foreground"
          }`}
        >
          {c.name}
        </a>
      ))}
    </div>
  );
}
