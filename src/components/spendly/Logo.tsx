import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & {
  mode?: "full" | "mark";
  className?: string;
};

const GRADIENTS = (
  <defs>
    <linearGradient id="sp-grad-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#7C3AED" />
      <stop offset="50%" stopColor="#8B5CF6" />
      <stop offset="100%" stopColor="#6366F1" />
    </linearGradient>
    <linearGradient id="sp-grad-wallet" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FCD34D" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
    <linearGradient id="sp-grad-coin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
    <linearGradient id="sp-grad-arrow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#34D399" />
      <stop offset="100%" stopColor="#10B981" />
    </linearGradient>
    <linearGradient id="sp-text-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#1F2937" />
      <stop offset="100%" stopColor="#4B5563" />
    </linearGradient>
    <linearGradient id="sp-text-grad-dark" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#F9FAFB" />
      <stop offset="100%" stopColor="#D1D5DB" />
    </linearGradient>
  </defs>
);

export function LogoMark({ className = "h-10 w-10", ...rest }: Omit<LogoProps, "mode">) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg" {...rest}>
      {GRADIENTS}
      <rect x="0" y="0" width="64" height="64" rx="16" fill="url(#sp-grad-bg)" />
      <rect
        x="15"
        y="19"
        width="34"
        height="26"
        rx="5.5"
        fill="url(#sp-grad-wallet)"
        stroke="#B45309"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <rect x="15" y="19" width="34" height="7" rx="3" fill="#F59E0B" fillOpacity="0.45" />
      <rect x="15" y="22" width="34" height="2" fill="#B45309" fillOpacity="0.18" />
      <circle cx="43.5" cy="32" r="3.2" fill="#0F172A" fillOpacity="0.35" />
      <circle cx="43.5" cy="32" r="1.5" fill="url(#sp-grad-bg)" />
      <path
        d="M24 39.5C22.5 38.5 22 37 22.5 35.5L26 30.5C26.8 29.3 28.5 29.1 29.6 29.9L33 32.3L37 28.3L39.3 30.6L33.2 36.7L30.4 34.6L28.2 38C27.1 39.8 24.9 40.1 24 39.5Z"
        fill="url(#sp-grad-arrow)"
      />
      <circle cx="20.5" cy="43.5" r="4.2" fill="url(#sp-grad-coin)" stroke="#B45309" strokeOpacity="0.2" />
      <path
        d="M20.5 40.5V46.5M18.5 42H22.5M19 43.5H22"
        stroke="#B45309"
        strokeOpacity="0.55"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className = "h-8", mode = "full", ...rest }: LogoProps) {
  if (mode === "mark") return <LogoMark className={className} {...rest} />;
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`} style={{ height: "auto" }}>
      <LogoMark className="h-9 w-9 shrink-0" {...rest} />
      <span
        className="whitespace-nowrap font-sans text-[22px] font-extrabold tracking-tight"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #1F2937 0%, #6366F1 50%, #8B5CF6 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          lineHeight: 1,
        }}
      >
        Spendly
      </span>
    </div>
  );
}
