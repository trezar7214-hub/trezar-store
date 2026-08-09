// Renders a real product photo when `src` is set, otherwise a soft
// gradient placeholder inside the arch frame so the storefront always
// looks finished. Replace placeholders with real photography from the
// admin dashboard (Products → Image URL) whenever it's ready.
const PALETTES = [
  ["#F0D9CE", "#C08872"],
  ["#EAC9C2", "#A2664E"],
  ["#F7E9E5", "#CBA07C"],
  ["#E4C9A6", "#8C5A44"],
];

function paletteFor(seed = "") {
  const idx = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTES.length;
  return PALETTES[idx];
}

export default function ProductImage({ src, alt, className = "", archTop = true }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${archTop ? "arch-top" : ""} ${className}`}
        loading="lazy"
      />
    );
  }

  const [from, to] = paletteFor(alt);
  const initial = (alt || "T").trim().charAt(0).toUpperCase();

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${archTop ? "arch-top" : ""} ${className}`}
      style={{ background: `linear-gradient(155deg, ${from}, ${to})` }}
      role="img"
      aria-label={alt}
    >
      <span className="font-display text-5xl text-white/90">{initial}</span>
    </div>
  );
}
