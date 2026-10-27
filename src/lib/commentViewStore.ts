"use client";

import { useSyncExternalStore } from "react";

// Comment view on/off: shared by the top-bar toggle and the page's CommentLayer, remembered per browser.
// Also mirrored on <html data-comment-view> so CSS can make room for the comments panel.
const KEY = "comment-view";
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function setCommentView(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  document.documentElement.dataset.commentView = on ? "on" : "off";
  listeners.forEach((l) => l());
}

export function useCommentView() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => false,
  );
}
