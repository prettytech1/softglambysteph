// In-memory router for the self-contained preview (the preview host can't serve real routes).
import { useSyncExternalStore } from "react";

type Loc = { path: string; search: string };
let loc: Loc = parse((typeof location !== "undefined" && location.hash.startsWith("#/")) ? location.hash.slice(1) : "/");
const subs = new Set<() => void>();

function parse(url: string): Loc {
  const [p, s = ""] = url.split("?");
  let path = p || "/";
  if (path.length > 1) path = path.replace(/\/$/, "");
  return { path, search: s };
}

export function navigate(url: string, opts: { replace?: boolean; scroll?: boolean } = {}) {
  const hashIdx = url.indexOf("#");
  const anchor = hashIdx >= 0 ? url.slice(hashIdx + 1) : "";
  const clean = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const next = clean.startsWith("?") ? { path: loc.path, search: clean.slice(1) } : clean ? parse(clean) : loc;
  const samePage = next.path === loc.path;
  loc = next;
  try { history.replaceState(null, "", `#${loc.path}${loc.search ? `?${loc.search}` : ""}`); } catch {}
  subs.forEach((f) => f());
  if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" }), 60);
  else if (opts.scroll !== false && !(samePage && opts.replace)) window.scrollTo({ top: 0 });
}

export function useLoc() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => loc, () => loc);
}
