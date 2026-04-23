import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  /** When true, width/height props are applied via inline style. Set to false to size via Tailwind classes in className. */
  useStyle?: boolean;
}

export default function Logo({
  width = 140,
  height = 56,
  className = "",
  useStyle = true,
}: LogoProps) {
  return (
    <div
      className={`relative group transition-all duration-500 ${className}`}
      style={useStyle ? { width, height } : undefined}
    >
      <Image
        src="/alia-go-logo.png"
        alt="ALIA GO"
        fill
        priority
        sizes="(max-width: 768px) 160px, 220px"
        className="object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(245,93,22,0.65)]"
      />
    </div>
  );
}
