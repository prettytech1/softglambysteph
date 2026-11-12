import { useMemo } from "react";
import { navigate, useLoc } from "./router";

export function usePathname() { return useLoc().path; }
export function useSearchParams() { const { search } = useLoc(); return useMemo(() => new URLSearchParams(search), [search]); }
export function useRouter() {
  return {
    push: (u: string, o?: { scroll?: boolean }) => navigate(u, o),
    replace: (u: string, o?: { scroll?: boolean }) => navigate(u, { ...o, replace: true }),
    back: () => history.back(), refresh: () => {}, prefetch: () => {},
  };
}
export class NotFoundError extends Error {}
export function notFound(): never { throw new NotFoundError("not found"); }
