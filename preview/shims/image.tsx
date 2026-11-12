type Props = { src: string; alt: string; fill?: boolean; width?: number; height?: number; sizes?: string; priority?: boolean; className?: string; style?: React.CSSProperties };
export default function Image({ src, alt, fill, width, height, priority, className, style }: Props) {
  const rel = src.startsWith("/") ? src.slice(1) : src; // published next to the page
  const s: React.CSSProperties = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : { ...style };
  return <img src={rel} alt={alt} width={fill ? undefined : width} height={fill ? undefined : height} loading={priority ? "eager" : "lazy"} decoding="async" className={className} style={s} />;
}
