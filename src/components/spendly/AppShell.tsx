import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Tags,
  Settings,
  Menu,
  Sparkles,
  Wallet,
  Moon,
  Sun,
  Database,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Logo, LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/analytics", label: "Analytics", icon: PieChart },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-gradient-to-r data-[status=active]:from-sidebar-primary/90 data-[status=active]:to-violet-500/70 data-[status=active]:text-white data-[status=active]:shadow-lg data-[status=active]:shadow-sidebar-primary/25"
        >
          <span className="grid h-[18px] w-[18px] shrink-0 place-items-center">
            <item.icon
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110 group-data-[status=active]:scale-110"
              strokeWidth={1.85}
            />
          </span>
          <span className="truncate tracking-tight">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { resolvedTheme } = useTheme();
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-sidebar px-4 py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sidebar-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
      />

      <div className="relative">
        <Link
          to="/"
          onClick={onNavigate}
          className="mb-8 flex items-center gap-3 px-2"
          aria-label="Spendly home"
        >
          <span className="relative shadow-lg shadow-black/10">
            <Logo className="h-8" />
            <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-sidebar shadow-md">
              <Sparkles className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
            </span>
          </span>
        </Link>
        <NavLinks onNavigate={onNavigate} />
      </div>

      <div className="relative mt-auto space-y-3">
        <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-white/[0.04] p-4 backdrop-blur-sm">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-sidebar-primary/30 to-violet-500/20 blur-2xl"
          />
          <div className="relative flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sidebar-primary to-violet-500 text-white shadow-lg shadow-sidebar-primary/25">
              <Wallet className="h-[18px] w-[18px]" strokeWidth={1.85} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold leading-tight text-white">
                Track. Manage. Grow.
              </p>
              <p className="mt-1 text-[11px] leading-snug text-sidebar-foreground/60">
                Flask REST API + SQLite
              </p>
            </div>
          </div>
          <div className="relative mt-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-sidebar-foreground/70 ring-1 ring-white/10">
                {resolvedTheme === "dark" ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : (
                  <Sun className="h-3.5 w-3.5" />
                )}
              </span>
              <span className="text-[10px] font-medium text-sidebar-foreground/50 capitalize">
                {resolvedTheme} mode
              </span>
            </div>
            <span className="text-[10px] font-medium text-sidebar-foreground/50">Spendly v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const title = useRouterState({
    select: (s) => NAV.find((n) => n.to === s.location.pathname)?.label ?? "Spendly",
  });

  return (
    <div className="relative min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] lg:block">
        <div className="h-full rounded-r-[28px] overflow-hidden shadow-2xl shadow-navy/10">
          <SidebarBody />
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-20">
          <div className="border-b border-border/60 bg-background/60 backdrop-blur-2xl backdrop-saturate-150">
            <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden hover:bg-muted/80"
                      aria-label="Open navigation"
                    >
                      <Menu className="h-5 w-5" strokeWidth={1.85} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[288px] border-0 bg-transparent p-0 shadow-2xl">
                    <div className="h-full overflow-hidden rounded-r-[28px]">
                      <SheetTitle className="sr-only">Navigation</SheetTitle>
                      <SidebarBody onNavigate={() => setOpen(false)} />
                    </div>
                  </SheetContent>
                </Sheet>
                <div className="lg:hidden">
                  <LogoMark className="h-9 w-9" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                      {title}
                    </h2>
                    <span className="hidden h-1.5 w-1.5 rounded-full bg-primary/70 sm:inline-block" />
                  </div>
                  <p className="mt-0.5 hidden truncate text-[11px] text-muted-foreground sm:block">
                    {title === "Dashboard" && "Your financial health at a glance"}
                    {title === "Transactions" && "All your income and expenses in one place"}
                    {title === "Analytics" && "Deep insights into your spending patterns"}
                    {title === "Categories" && "See where each rupee is going"}
                    {title === "Settings" && "Customize your Spendly experience"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <ThemeToggle size="icon" />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Database Status"
                  title="Connected to SQLite"
                  className="relative hover:bg-muted/80"
                >
                  <Database className="h-[18px] w-[18px] text-income" strokeWidth={1.85} />
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center">
                    <span className="relative h-1.5 w-1.5 rounded-full bg-income" />
                  </span>
                </Button>
                <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card/80 py-1 pl-1 pr-3.5 shadow-sm transition-all duration-200 hover:border-primary/30">
                  <div className="relative">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary via-brand to-brand-dark text-xs font-bold text-white shadow-md shadow-primary/20">
                      SP
                    </span>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-income ring-2 ring-card" />
                  </div>
                  <div className="hidden text-left sm:block">
                    <span className="block text-[12px] font-semibold leading-tight text-foreground">
                      Spendly Hub
                    </span>
                    <span className="block text-[10px] leading-tight text-muted-foreground">
                      SQLite · Local
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-8 lg:pb-12 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
