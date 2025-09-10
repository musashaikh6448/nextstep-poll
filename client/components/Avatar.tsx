export default function Avatar({ name, color, size = 36 }: { name: string; color?: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const style = color ? { background: `linear-gradient(135deg, hsl(${color}), hsl(${color} / 70%))` } : {};
  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full text-sm font-semibold text-white" style={{ width: size, height: size, ...style }}>
      {initials}
    </div>
  );
}
