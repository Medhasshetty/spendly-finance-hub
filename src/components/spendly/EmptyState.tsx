import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent blur-3xl" />
      </div>
      <div className="relative z-10">
        <div className="relative mx-auto mb-5">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <span className="relative grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent ring-1 ring-primary/20 backdrop-blur-sm">
            <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
          </span>
        </div>
        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            {title}
          </span>
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
