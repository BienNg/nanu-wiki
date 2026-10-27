"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Area } from "@/lib/types";
import { Icon } from "./Icon";
import { SearchOverlay } from "./SearchOverlay";

const WIDTH_KEY = "nanu.sidebar.width";
const COLLAPSED_KEY = "nanu.sidebar.collapsed";
const DEFAULT_WIDTH = 252;
const MIN_WIDTH = 200;
const MAX_WIDTH = 440;
const RAIL_WIDTH = 56;

type ShellContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  openSearch: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function useShell() {
  const value = useContext(ShellContext);
  if (!value) throw new Error("useShell must be used inside AppShell");
  return value;
}

export function SearchTrigger({ className }: { className?: string }) {
  const { openSearch } = useShell();
  return (
    <button type="button" onClick={openSearch} title="Suchen" className={className}>
      <Icon name="search" size={14} strokeWidth={2} />
      <span className="side-text min-w-0 flex-1 text-left">
        <span className="dx">Suchen …</span>
        <span className="vx">Tìm kiếm …</span>
      </span>
    </button>
  );
}

export function CollapseSidebarButton() {
  const { collapsed, toggleCollapsed } = useShell();
  return (
    <button
      type="button"
      onClick={toggleCollapsed}
      aria-expanded={!collapsed}
      aria-label={collapsed ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
      title={collapsed ? "Seitenleiste ausklappen" : "Seitenleiste einklappen"}
      className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink"
    >
      <PanelIcon />
    </button>
  );
}

export function AppShell({
  sidebar,
  children,
  areas,
  showSearch,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  areas: Area[];
  showSearch: boolean;
}) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const drag = useRef<{ startX: number; startW: number } | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(WIDTH_KEY));
    if (stored >= MIN_WIDTH && stored <= MAX_WIDTH) setWidth(stored);
    const collapsedStored = localStorage.getItem(COLLAPSED_KEY);
    if (collapsedStored === "1") setCollapsed(true);
    else if (collapsedStored === null && window.innerWidth < 768) setCollapsed(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || dragging) return;
    localStorage.setItem(WIDTH_KEY, String(width));
    localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
  }, [width, collapsed, ready, dragging]);

  useEffect(() => {
    if (!dragging) return;
    const previousCursor = document.body.style.cursor;
    const previousSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelect;
    };
  }, [dragging]);

  useEffect(() => {
    if (!showSearch) return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSearch]);

  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);
  const openSearch = useCallback(() => {
    if (showSearch) setSearchOpen(true);
  }, [showSearch]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const shell = useMemo(
    () => ({ collapsed, toggleCollapsed, openSearch }),
    [collapsed, toggleCollapsed, openSearch],
  );

  const offset = collapsed ? RAIL_WIDTH : width;

  function onResizeDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startW: width };
    setDragging(true);
  }

  function onResizeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, drag.current.startW + e.clientX - drag.current.startX));
    setWidth(next);
  }

  function onResizeUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <ShellContext.Provider value={shell}>
      <div className="flex min-h-dvh items-start bg-white">
        <div
          className={`sticky top-0 z-20 h-dvh flex-none self-start border-r border-line bg-side ${
            dragging ? "" : "transition-[width] duration-200 ease-out motion-reduce:transition-none"
          }`}
          style={{ width: offset }}
          data-collapsed={collapsed ? "true" : "false"}
        >
          <div className="h-full min-w-0">{sidebar}</div>

          {!collapsed && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-valuemin={MIN_WIDTH}
              aria-valuemax={MAX_WIDTH}
              aria-valuenow={Math.round(width)}
              aria-label="Seitenleiste in der Breite ändern"
              tabIndex={0}
              onPointerDown={onResizeDown}
              onPointerMove={onResizeMove}
              onPointerUp={onResizeUp}
              onPointerCancel={onResizeUp}
              onDoubleClick={() => setWidth(DEFAULT_WIDTH)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setWidth((value) => Math.max(MIN_WIDTH, value - (e.shiftKey ? 32 : 16)));
                if (e.key === "ArrowRight") setWidth((value) => Math.min(MAX_WIDTH, value + (e.shiftKey ? 32 : 16)));
                if (e.key === "Home") setWidth(MIN_WIDTH);
                if (e.key === "End") setWidth(MAX_WIDTH);
              }}
              className="group absolute -right-1 top-0 z-30 h-full w-2 cursor-col-resize touch-none outline-none"
            >
              <span className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
            </div>
          )}
        </div>

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">{children}</div>
      </div>

      {showSearch && (
        <SearchOverlay open={searchOpen} onClose={closeSearch} areas={areas} left={offset} />
      )}
    </ShellContext.Provider>
  );
}

function PanelIcon() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  );
}
