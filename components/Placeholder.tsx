/** Marks content the client still needs to supply. Easy to spot on the page and to grep for in code. */
export function Placeholder({ children, inline = false }: { children: React.ReactNode; inline?: boolean }) {
  const cls = "border border-dashed border-rose/70 bg-shell/70 text-cocoa-soft text-sm rounded-xl";
  if (inline) return <span className={`${cls} inline-block px-2 py-0.5 rounded-md`} data-placeholder>{children}</span>;
  return <div className={`${cls} px-4 py-3`} data-placeholder>{children}</div>;
}
