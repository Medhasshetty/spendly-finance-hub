import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Globe,
  Moon,
  Sun,
  Monitor,
  DollarSign,
  Mail,
  MessageSquare,
  Smartphone,
  Trash2,
  Download,
  Upload,
  ChevronRight,
  Check,
  Lock,
  Eye,
  CreditCard,
  HelpCircle,
  FileText,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/spendly/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme, type Theme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Spendly" },
      { name: "description", content: "Customize your Spendly experience, manage preferences and account settings." },
      { property: "og:title", content: "Settings — Spendly" },
      { property: "og:description", content: "Manage your Spendly account and preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const [accentIndex, setAccentIndex] = useState(1);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (section: string, successMsg: string) => {
    setSaved((prev) => ({ ...prev, [section]: true }));
    toast.success(successMsg);
    setTimeout(() => setSaved((prev) => ({ ...prev, [section]: false })), 2000);
  };

  const handleAvatarClick = () => avatarInputRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setAvatarFileName(f.name);
      toast.success("Profile picture updated", { description: `"${f.name}" will be used as your avatar.` });
    }
  };

  const handleImportClick = () => importInputRef.current?.click();
  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImportFileName(f.name);
      toast.success("File ready to import", { description: `"${f.name}" detected. Click import to process.` });
    }
  };

  const accents = [
    { name: "Emerald", from: "from-emerald-400", to: "to-teal-500", ring: "ring-emerald-400" },
    { name: "Indigo", from: "from-indigo-400", to: "to-violet-600", ring: "ring-indigo-400" },
    { name: "Rose", from: "from-rose-400", to: "to-pink-600", ring: "ring-rose-400" },
    { name: "Amber", from: "from-amber-400", to: "to-orange-500", ring: "ring-amber-400" },
    { name: "Sky", from: "from-sky-400", to: "to-cyan-500", ring: "ring-sky-400" },
    { name: "Violet", from: "from-violet-400", to: "to-purple-600", ring: "ring-violet-400" },
  ];

  const themeOptions: { key: Theme; label: string; icon: typeof Sun; desc: string }[] = [
    { key: "light", label: "Light", icon: Sun, desc: "Clean & bright" },
    { key: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { key: "system", label: "System", icon: Monitor, desc: "Follow device" },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Settings"
        subtitle="Customize your Spendly experience and manage your account."
        action={
          <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-primary">
            <Check className="h-3 w-3" /> All changes auto-saved
          </Badge>
        }
      />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-1.5 sm:grid-cols-5">
          <TabsTrigger value="profile" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Palette className="h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Bell className="h-4 w-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2 rounded-xl py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Database className="h-4 w-4" /> Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-6">
          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-brand/20 text-primary">
                  <User className="h-4 w-4" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription>Update your profile details and how you appear on Spendly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-muted text-xl shadow-md">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-brand font-semibold text-white">MS</AvatarFallback>
                  </Avatar>
                  <Button type="button" size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-card bg-card shadow-md hover:border-primary/40" onClick={handleAvatarClick} title="Upload photo">
                    <Upload className="h-3.5 w-3.5" />
                  </Button>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Medha S.</h3>
                  <p className="text-sm text-muted-foreground">medha@spendly.app</p>
                  {avatarFileName && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] text-primary">
                      <FileText className="h-3 w-3" /> {avatarFileName}
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-income/30 bg-income/10 text-income">Verified email</Badge>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Premium member</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" defaultValue="Medha S." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input id="display-name" defaultValue="Medha" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" defaultValue="medha@spendly.app" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" defaultValue="+91 98765 43210" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <Input id="bio" defaultValue="Finance enthusiast. Building better money habits." />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => handleSave("profile", "Profile saved successfully!")} className="min-w-[140px]">
                  {saved.profile ? <Check className="h-4 w-4" /> : null}
                  {saved.profile ? "Saved" : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400/20 to-accent text-amber-600 dark:text-amber-400">
                  <Globe className="h-4 w-4" />
                </div>
                Regional Preferences
              </CardTitle>
              <CardDescription>Set your default currency, language and date formats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee</SelectItem>
                      <SelectItem value="USD">$ US Dollar</SelectItem>
                      <SelectItem value="EUR">€ Euro</SelectItem>
                      <SelectItem value="GBP">£ British Pound</SelectItem>
                      <SelectItem value="JPY">¥ Japanese Yen</SelectItem>
                      <SelectItem value="AUD">A$ Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="Spanish">Español</SelectItem>
                      <SelectItem value="French">Français</SelectItem>
                      <SelectItem value="German">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date format</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger id="date-format" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={() => handleSave("region", "Regional preferences saved!")}>
                  {saved.region ? <Check className="h-4 w-4" /> : null}
                  {saved.region ? "Saved" : "Save preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0 space-y-6">
          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-navy/20 text-brand">
                  <Palette className="h-4 w-4" />
                </div>
                Theme & Mode
              </CardTitle>
              <CardDescription>Choose how Spendly looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Appearance mode</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Currently: <span className="font-semibold capitalize text-primary">{resolvedTheme}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary capitalize">
                    {theme === "system" ? `Follows system → ${resolvedTheme}` : `${theme} mode active`}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {themeOptions.map((item) => {
                    const Icon = item.icon;
                    const active = theme === item.key;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => {
                          setTheme(item.key);
                          toast.success("Theme updated", { description: `Spendly is now in ${item.label} mode.` });
                        }}
                        className={`group relative flex flex-col items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                          active
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-md shadow-primary/10"
                            : "border-border bg-card hover:border-muted-foreground/20 hover:bg-muted/40"
                        }`}
                      >
                        <div className={`grid h-10 w-10 place-items-center rounded-xl transition-colors ${
                          active ? "bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-md shadow-primary/30" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        {active && (
                          <div className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-md">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-foreground">Accent color</Label>
                <p className="mt-1 text-xs text-muted-foreground">Pick the color that will be used for highlights.</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {accents.map((c, i) => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => {
                        setAccentIndex(i);
                        toast.message(`Accent: ${c.name}`, { description: "Palette preference saved." });
                      }}
                      className={`relative h-12 w-12 rounded-2xl bg-gradient-to-br ${c.from} ${c.to} ring-offset-2 transition-all hover:scale-110 hover:shadow-lg ${
                        accentIndex === i ? `ring-2 ring-offset-2 ${c.ring}` : "hover:ring-2 hover:ring-muted-foreground/30"
                      }`}
                      aria-label={c.name}
                      title={c.name}
                    >
                      {accentIndex === i && (
                        <span className="absolute inset-0 m-auto grid h-5 w-5 place-items-center rounded-full bg-white/95 shadow-md">
                          <Check className="h-3.5 w-3.5" style={{ color: "#4B5563" }} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl p-1">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Compact density</p>
                      <p className="text-xs text-muted-foreground">Reduce spacing to fit more content.</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between rounded-2xl p-1">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Reduce motion</p>
                      <p className="text-xs text-muted-foreground">Minimize animations throughout the app.</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-6">
          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400/20 to-rose-400/20 text-orange-500">
                  <Bell className="h-4 w-4" />
                </div>
                How you want to be notified
              </CardTitle>
              <CardDescription>Stay in control of what reaches you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { key: "email", icon: Mail, label: "Email notifications", desc: "Monthly reports and important account updates via email.", state: notifEmail, set: setNotifEmail },
                { key: "push", icon: Smartphone, label: "Push notifications", desc: "Instant alerts on your phone for new transactions and reminders.", state: notifPush, set: setNotifPush },
                { key: "weekly", icon: MessageSquare, label: "Weekly digest", desc: "A friendly summary of your spending and savings each Sunday.", state: notifWeekly, set: setNotifWeekly },
                { key: "marketing", icon: Bell, label: "Product news & tips", desc: "Occasional emails about new features, budgeting tips and offers.", state: notifMarketing, set: setNotifMarketing },
              ].map((n) => (
                <div key={n.key} className="flex items-start justify-between gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/40">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{n.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={n.state}
                    onCheckedChange={(v) => {
                      n.set(v);
                      toast.message(`${n.label} ${v ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Smart alerts
              </CardTitle>
              <CardDescription>We'll let you know when something needs your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "High spending alert", desc: "Notify me when I spend more than my weekly average.", defaultChecked: true },
                { label: "Low balance warning", desc: "Warn me when my balance drops below a threshold.", defaultChecked: true },
                { label: "Bill due reminders", desc: "Reminders for recurring bills and subscriptions.", defaultChecked: true },
                { label: "Goal progress", desc: "Monthly updates on savings goal progress.", defaultChecked: false },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/40">
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                  <Switch
                    defaultChecked={s.defaultChecked}
                    onCheckedChange={(v) => toast.message(`${s.label} ${v ? "on" : "off"}`)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-0 space-y-6">
          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-navy/20 to-primary/20 text-navy">
                  <Shield className="h-4 w-4" />
                </div>
                Sign-in & security
              </CardTitle>
              <CardDescription>Keep your financial data safe and secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-muted-foreground">Last changed 32 days ago · Strong</p>
                  </div>
                </div>
                <Button variant="ghost" className="gap-1" onClick={() => toast.message("Change password flow opened")}>
                  Change <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                      {twoFactor ? (
                        <Badge variant="outline" className="border-income/30 bg-income/10 text-income">On</Badge>
                      ) : (
                        <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Off</Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Add an extra layer of security when signing in.</p>
                  </div>
                </div>
                <Switch
                  checked={twoFactor}
                  onCheckedChange={(v) => {
                    setTwoFactor(v);
                    toast.success(v ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-2xl p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Biometric unlock</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Use fingerprint or Face ID on mobile.</p>
                  </div>
                </div>
                <Switch
                  checked={biometric}
                  onCheckedChange={(v) => {
                    setBiometric(v);
                    toast.message(`Biometric unlock ${v ? "on" : "off"}`);
                  }}
                />
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-foreground">Database & Local Storage</Label>
                <p className="mt-1 text-xs text-muted-foreground">Local SQLite storage details for your Spendly instance.</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">SQLite Database (expense_tracker.db)</p>
                        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Active</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">Flask REST Backend · Port 5000</p>
                    </div>
                    <Badge variant="outline" className="border-income/30 bg-income/10 text-income">Connected</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-0 space-y-6">
          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-400/20 text-sky-600 dark:text-sky-400">
                  <Database className="h-4 w-4" />
                </div>
                Your data
              </CardTitle>
              <CardDescription>Export, import or manage your financial records.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input ref={importInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImportChange} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col rounded-2xl border border-border/60 p-5 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand/20 to-primary/20 text-primary shadow-sm">
                      <Download className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Export all data</p>
                      <p className="text-xs text-muted-foreground">Download CSV backup of your SQLite records</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 justify-start gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={async () => {
                      try {
                        const { spendlyApi } = await import("@/lib/api");
                        const txs = await spendlyApi.getTransactions();
                        if (txs.length === 0) {
                          toast.info("No transactions to export yet.");
                          return;
                        }
                        const headers = ["ID", "Type", "Category", "Amount", "Date", "Description"];
                        const csvRows = [
                          headers.join(","),
                          ...txs.map((t) =>
                            [
                              t.id,
                              t.type,
                              `"${t.category}"`,
                              t.amount,
                              t.date,
                              `"${(t.description || "").replace(/"/g, '""')}"`,
                            ].join(",")
                          ),
                        ];
                        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `spendly_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
                        link.click();
                        URL.revokeObjectURL(url);
                        toast.success("Transactions exported successfully!");
                      } catch {
                        toast.error("Failed to export transactions.");
                      }
                    }}
                  >
                    <Download className="h-4 w-4" /> Download (.csv)
                  </Button>
                </div>

                <div className="flex flex-col rounded-2xl border border-border/60 p-5 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-muted text-accent-foreground shadow-sm">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">Import transactions</p>
                      <p className="text-xs text-muted-foreground">
                        {importFileName ? `Selected: ${importFileName}` : "Upload CSV from your bank"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button type="button" variant="outline" className="flex-1 justify-start gap-2" onClick={handleImportClick}>
                      <Upload className="h-4 w-4" /> Choose file
                    </Button>
                    <Button
                      type="button"
                      disabled={!importFileName}
                      onClick={() =>
                        importFileName &&
                        toast.success("Import processed", {
                          description: `Read transactions from "${importFileName}".`,
                        })
                      }
                    >
                      Import
                    </Button>
                  </div>
                  {importFileName && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-income/20 bg-income/5 px-3 py-1.5 text-[11px] text-income">
                      <FileText className="h-3.5 w-3.5" /> Ready to import <strong className="font-semibold">{importFileName}</strong>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-surface border-0 shadow-none">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                About & Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-muted/40 cursor-pointer" onClick={() => toast.message("Spendly Help", { description: "Add transactions via the + button or shortcut." })}>
                <div>
                  <p className="text-sm font-medium text-foreground">Help & support</p>
                  <p className="text-xs text-muted-foreground">Personal Finance Tracker documentation.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-muted/40 cursor-pointer" onClick={() => toast.message("Keyboard shortcuts: Ctrl+K to search, Alt+N new transaction")}>
                <div>
                  <p className="text-sm font-medium text-foreground">Keyboard shortcuts</p>
                  <p className="text-xs text-muted-foreground">Speed up your workflow.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <Separator />
              <p className="pt-2 text-center text-[11px] text-muted-foreground">
                Spendly Finance Hub v1.0.0 · Python Flask & SQLite · {resolvedTheme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
