import logo from "@/assets/spendly-logo.png.asset.json";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="Spendly — Track. Manage. Grow."
      className={`${className} w-auto`}
      width={192}
      height={64}
    />
  );
}

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`${className} inline-block shrink-0 overflow-hidden rounded-md`}
      aria-hidden="true"
      style={{
        backgroundImage: `url(${logo.url})`,
        backgroundSize: "480% auto",
        backgroundPosition: "8% center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
