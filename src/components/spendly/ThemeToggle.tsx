import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ size = "default" }: { size?: "sm" | "default" | "icon" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options: { key: Theme; label: string; icon: typeof Sun }[] = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
  ];
  const current = options.find((o) => o.key === theme) ?? options[0];
  const CurrentIcon = current.icon;
  const isDark = resolvedTheme === "dark";
  const ToggleIcon = isDark ? Moon : Sun;

  if (size === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="group relative overflow-hidden" aria-label="Toggle theme">
            <span
              aria-hidden="true"
              className="absolute inset-0 scale-0 rounded-full bg-gradient-to-br from-primary/15 to-violet-500/10 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            />
            <ToggleIcon className="h-[18px] w-[18px] relative z-10 transition-transform duration-300 group-hover:rotate-12" strokeWidth={1.85} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 rounded-2xl border-border/80 p-1.5 shadow-xl">
          {options.map(({ key, label, icon: Icon }) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key)}
              className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                theme === key
                  ? "bg-gradient-to-r from-primary/15 via-violet-500/10 to-transparent text-primary"
                  : "hover:bg-muted/60 text-foreground/80"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all ${
                  theme === key
                    ? "bg-gradient-to-br from-primary/20 to-violet-500/10 text-primary ring-1 ring-primary/20"
                    : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.85} />
              </span>
              <span className="flex-1">{label}</span>
              {theme === key && (
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-violet-500 shadow-md shadow-primary/30" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size === "sm" ? "sm" : "default"} className="gap-2 border-border/60">
          <CurrentIcon className="h-4 w-4" strokeWidth={1.85} />
          <span className="text-xs font-semibold uppercase tracking-wider">{current.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 rounded-2xl border-border/80 p-1.5 shadow-xl">
        {options.map(({ key, label, icon: Icon }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium ${
              theme === key
                ? "bg-gradient-to-r from-primary/15 via-violet-500/10 to-transparent text-primary"
                : "hover:bg-muted/60 text-foreground/80"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.85} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
