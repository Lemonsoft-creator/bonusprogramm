import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { CalendarCheck2, Gift, Medal, Settings, Sparkles, Trophy, Users, CheckCircle2, XCircle, Search, Shield, LogOut, LogIn, Edit3, PlusCircle, RotateCcw, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";

/**
 * All in Sport Bonusprogramm – React Mockup (Duolingo-inspired, Auth + Admin + Challenges)
 * - Full feature: Login, User, Admin, Queues (points/vouchers/challenge submissions),
 *   Direct Grants, User Mgmt, Challenge Mgmt.
 */

// Bright playful palette
const palette = {
  primary: "#58CC02", // Duolingo green
  secondary: "#FFD43B", // yellow
  sky: "#00B9F1",
  pink: "#FF4B6E",
  purple: "#A259FF",
};

const POINT_RULES = {
  TRAINING: { label: "Training", points: 1 },
  NEW_CLIENT: { label: "Neukunde (≥10er-Abo)", points: 50 },
  COMPANY_TRAINING: { label: "Firmentraining", points: 75 },
  PRIVATE_TRAINING: { label: "Privattraining", points: 10 },
  SPECIAL_EVENT: { label: "Spezial-Event", points: 5 },
} as const;

const LEVELS = [
  { min: 100, max: 149, reward: { type: "VOUCHER", value: 50 }, color: palette.secondary, label: "CHF 50" },
  { min: 150, max: 199, reward: { type: "VOUCHER", value: 100 }, color: palette.sky, label: "CHF 100" },
  { min: 200, max: 249, reward: { type: "VOUCHER", value: 200 }, color: palette.purple, label: "CHF 200" },
  { min: 250, max: Infinity, reward: { type: "PRIVATE_TRAINING", value: 1 }, color: palette.pink, label: "1× PT" },
] as const;

const LEVEL_BADGE = (points: number) => LEVELS.find((l) => points >= l.min && points <= (isFinite(l.max as number) ? (l.max as number) : points));

function classNames(...c: (string | false | null | undefined)[]) { return c.filter(Boolean).join(" "); }

// Circular progress ring styled playful
function Ring({ total, next }: { total: number; next: number }) {
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(1, total / next);
  const dash = circ * pct;
  const level = LEVEL_BADGE(total);
  return (
    <svg viewBox="0 0 160 160" className="size-40 drop-shadow-lg">
      <circle cx="80" cy="80" r={radius} className="stroke-slate-200" strokeWidth="16" fill="none" />
      <motion.circle
        cx="80" cy="80"
        r={radius}
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1 }}
        style={{ stroke: level?.color ?? palette.primary }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-800 font-bold text-2xl">
        {total}★
      </text>
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-500 text-xs">
        Next {next}★
      </text>
    </svg>
  );
}

// ===== Seed data =====
const seedUsers = [
  { id: "u1", firstName: "Max", lastName: "Mustermann", email: "max@example.com", totalPoints: 162 },
  { id: "u2", firstName: "Erika", lastName: "Muster", email: "erika@example.com", totalPoints: 176 },
  { id: "u3", firstName: "Luca", lastName: "Bernasconi", email: "luca@example.com", totalPoints: 210 },
  { id: "u4", firstName: "Samira", lastName: "Khan", email: "samira@example.com", totalPoints: 140 },
];

const seedUserProfile = {
  id: "u1",
  name: "Max Mustermann",
  email: "max@example.com",
  totalPoints: 162,
  ledger: [
    { id: "l1", date: "2025-09-01", points: +50, rule: "NEW_CLIENT", note: "Anna geworben" },
    { id: "l2", date: "2025-09-03", points: +1, rule: "TRAINING", note: "Montag" },
  ],
  vouchers: [
    { id: "v1", label: "CHF 50", status: "redeemed", code: "SN-50A1", issued_at: "2025-03-02", expires_at: "2026-03-02" },
  ],
};

const seedQueues = {
  pointRequests: [
    { id: "pr1", user: "Max Mustermann", type: "TRAINING", date: "2025-09-10", note: "Abend-Session", status: "pending" },
  ],
  voucherRequests: [
    { id: "rq1", user: "Max Mustermann", level: "CHF 100", threshold: 150, status: "requested" },
  ],
  challengeSubmissions: [
    { id: "cs1", user: "Max Mustermann", challenge: { id: "c1", name: "30 Liegestütze in 1 Minute", description: "Schaffe 30 Push-ups innerhalb einer Minute.", points: 30, from: "2025-09-10", to: "2025-09-20" }, status: "pending" },
  ],
};

const seedChallenges = [
  { id: "c1", name: "30 Liegestütze in 1 Minute", description: "Schaffe 30 Push-ups innerhalb einer Minute.", points: 30, from: "2025-09-10", to: "2025-09-20" },
];

// ===== User-facing components =====
function UserDashboard({
  user,
  allUsers,
  challenges,
  onSubmitChallenge,
}: {
  user: any;
  allUsers: any[];
  challenges: any[];
  onSubmitChallenge: (id: string) => void;
}) {
  const total = user.totalPoints;

  const nextThreshold = useMemo(() => {
    const higher = LEVELS.map((l) => l.min)
      .filter((m) => m > total)
      .sort((a, b) => a - b)[0];
    return higher ?? total;
  }, [total]);

  const remaining = Math.max(0, nextThreshold - total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Fortschritt-Card */}
      <Card className="col-span-1 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Medal className="size-10 text-green-600" />
          <CardTitle className="mt-2 text-2xl font-bold">
            Hey {user.name}!
          </CardTitle>
          <CardDescription className="text-base">
            Dein Fortschritt
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Ring total={total} next={nextThreshold} />
          <div className="font-semibold text-lg">
            Noch {remaining} Punkte bis zur nächsten Stufe!
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Flame className="size-4" /> Streak: 5 Tage 🔥
          </div>
        </CardContent>
      </Card>

      {/* Rechte Seite: Neue Aktivität, Leaderboard, Challenges, Verlauf */}
      <div className="lg:col-span-2 grid gap-6">
        {/* Neue Aktivität */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck2 className="size-5 text-green-600" />
              Neue Aktivität
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PointRequestForm />
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Leaderboard me={user.id} users={allUsers} />

        {/* Challenges */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="size-5 text-purple-600" />
              Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {challenges.map((c: any) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-slate-100 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{c.name}</div>
                  <div className="text-sm text-slate-500">
                    {c.description}
                  </div>
                  <div className="text-xs">
                    {c.points}★ • {c.from} – {c.to}
                  </div>
                </div>
                <Button
                  className="rounded-xl bg-green-500 text-white"
                  onClick={() => onSubmitChallenge(c.id)}
                >
                  Einreichen
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Verlauf */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-sky-600" />
              Verlauf
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Aktivität</TableHead>
                  <TableHead className="text-right">Punkte</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.ledger.map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>
                      {POINT_RULES[e.rule as keyof typeof POINT_RULES]?.label ||
                        e.rule}
                    </TableCell>
                    <TableCell className="text-right">
                      {e.points > 0 ? `+${e.points}` : e.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PointRequestForm() {
  const [type, setType] = useState<keyof typeof POINT_RULES>("TRAINING");

  return (
    <form className="grid gap-4">
      <Select
        value={type}
        onValueChange={(v: keyof typeof POINT_RULES) => setType(v)}
      >
        <SelectTrigger className="w-full rounded-xl border-2 border-green-300">
          <SelectValue placeholder="Aktivität wählen" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(POINT_RULES).map(([k, v]) => (
            <SelectItem key={k} value={k}>
              {v.label} (+{v.points})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input type="date" className="rounded-xl border-2 border-green-200" />
      <Textarea
        placeholder="Kommentar…"
        className="rounded-xl border-2 border-green-200"
      />
      <Button className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold">
        Einreichen
      </Button>
    </form>
  );
}

// ===== Admin components =====
function AdminDashboard({ queues, challenges, users, onApprovePR, onRejectPR, onIssueVoucher, onApproveChallenge, onGrantPoints, onUpdateUser, onResetPw, onAdjustPoints, onCreateChallenge }: any) {
  const [query, setQuery] = useState("");
  const filteredPR = queues.pointRequests.filter((r: any) => r.user.toLowerCase().includes(query.toLowerCase()));
  const filteredVR = queues.voucherRequests.filter((r: any) => r.user.toLowerCase().includes(query.toLowerCase()));
  const filteredCS = queues.challengeSubmissions.filter((r: any) => r.user.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="size-5 text-green-600"/>Approval-Queues</CardTitle>
          <CardDescription>Punkteanträge, Challenges & Gutscheine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="size-4 text-muted-foreground"/>
            <Input placeholder="User suchen…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Tabs defaultValue="points">
            <TabsList>
              <TabsTrigger value="points">Punkteanträge</TabsTrigger>
              <TabsTrigger value="challenges">Challenge-Einreichungen</TabsTrigger>
              <TabsTrigger value="vouchers">Gutscheine</TabsTrigger>
            </TabsList>
            <TabsContent value="points" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Notiz</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPR.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.user}</TableCell>
                      <TableCell>{POINT_RULES[r.type as keyof typeof POINT_RULES].label}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell className="max-w-56 truncate" title={r.note}>{r.note}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onRejectPR(r.id)} className="border-rose-200 text-rose-700"><XCircle className="mr-1 size-4"/>Reject</Button>
                        <Button size="sm" onClick={() => onApprovePR(r.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="mr-1 size-4"/>Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="challenges" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Challenge</TableHead>
                    <TableHead>Punkte</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCS.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.user}</TableCell>
                      <TableCell>{r.challenge.name}</TableCell>
                      <TableCell>{r.challenge.points}★</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {/* reject == ignore */}} className="border-rose-200 text-rose-700"><XCircle className="mr-1 size-4"/>Reject</Button>
                        <Button size="sm" onClick={() => onApproveChallenge(r.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="mr-1 size-4"/>Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="vouchers" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVR.map((r: any) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.user}</TableCell>
                      <TableCell>{r.level}</TableCell>
                      <TableCell><Status s={r.status} /></TableCell>
                      <TableCell className="text-right"><IssueVoucherDialog onIssue={(code) => onIssueVoucher(r.id, code)} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings className="size-5 text-sky-600"/>Konfiguration</CardTitle>
          <CardDescription>Regeln, Level & Fairness</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Streaks</div>
              <div className="text-sm text-muted-foreground">+2 Punkte pro durchgehender Woche</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Challenges</div>
              <div className="text-sm text-muted-foreground">Aktiviert</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Firmentraining Punkte</Label>
            <Input type="number" defaultValue={POINT_RULES.COMPANY_TRAINING.points} />
          </div>
          <div className="space-y-2">
            <Label>Level-Farben</Label>
            <div className="grid grid-cols-4 gap-2">
              {LEVELS.slice(0,4).map((l, i) => (
                <div key={i} className="rounded-xl p-3 text-white text-sm text-center" style={{ backgroundColor: l.color }}>{l.label}</div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PlusCircle className="size-5 text-green-600"/>Punkte direkt vergeben</CardTitle>
          <CardDescription>Ohne Antrag – z. B. Events oder Korrekturen</CardDescription>
        </CardHeader>
        <CardContent>
          <GrantPointsForm users={users} onGrant={onGrantPoints} />
        </CardContent>
      </Card>

      <Card className="xl:col-span-3 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="size-5 text-purple-600"/>Userverwaltung</CardTitle>
          <CardDescription>Name, Vorname, Passwort zurücksetzen, Punkte verändern</CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={users} onUpdateUser={onUpdateUser} onResetPw={onResetPw} onAdjustPoints={onAdjustPoints} />
        </CardContent>
      </Card>

      <Card className="xl:col-span-3 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="size-5 text-purple-600"/>Challenges verwalten</CardTitle>
          <CardDescription>Erstellen & Übersicht</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChallengeForm onCreate={onCreateChallenge} />
          <div className="grid gap-2">
            {challenges.map((c:any)=>(
              <div key={c.id} className="p-3 rounded-xl bg-slate-100">
                <div className="font-bold">{c.name}</div>
                <div className="text-sm">{c.description}</div>
                <div className="text-xs">{c.points}★ • {c.from} – {c.to}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Status({ s }: { s: string }) {
  const map: Record<string, string> = { pending: "bg-amber-100 text-amber-800", approved: "bg-emerald-100 text-emerald-800", rejected: "bg-rose-100 text-rose-800", requested: "bg-sky-100 text-sky-800", issued: "bg-violet-100 text-violet-800", redeemed: "bg-green-100 text-green-800", expired: "bg-slate-200 text-slate-700" };
  return <span className={classNames("px-2 py-0.5 rounded-full text-xs font-medium", map[s] || "bg-slate-100")}>{s}</span>;
}

function IssueVoucherDialog({ onIssue }: { onIssue: (code: string) => void }) {
  const [code, setCode] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" className="rounded-xl"><Gift className="mr-1 size-4"/>Code ausstellen</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gutscheincode ausstellen</DialogTitle>
          <DialogDescription>Code wird 12 Monate gültig sein.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label>Code</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SN-XXXX" />
          <Button onClick={() => onIssue(code)} disabled={!code} className="bg-green-500 hover:bg-green-600 text-white rounded-xl">Ausstellen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GrantPointsForm({ users, onGrant }: any) {
  const [uid, setUid] = useState(users[0]?.id || "");
  const [type, setType] = useState<keyof typeof POINT_RULES>("TRAINING");
  const [date, setDate] = useState("2025-09-11");
  const [note, setNote] = useState("");
  const pts = POINT_RULES[type].points;
  return (
    <div className="grid sm:grid-cols-5 gap-3 items-end">
      <div className="sm:col-span-1">
        <Label>User</Label>
        <Select value={uid} onValueChange={setUid}>
          <SelectTrigger className="w-full mt-1 rounded-xl border-2 border-green-300"><SelectValue placeholder="User wählen"/></SelectTrigger>
          <SelectContent>
            {users.map((u:any)=> <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Aktivität</Label>
        <Select value={type} onValueChange={(v: keyof typeof POINT_RULES)=>setType(v)}>
          <SelectTrigger className="w-full mt-1 rounded-xl border-2 border-green-300"><SelectValue/></SelectTrigger>
          <SelectContent>
            {Object.entries(POINT_RULES).map(([k,v])=> <SelectItem key={k} value={k}>{v.label} (+{v.points})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Datum</Label>
        <Input type="date" className="mt-1 rounded-xl border-2 border-green-200" value={date} onChange={(e)=>setDate(e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <Label>Notiz</Label>
        <Input className="mt-1 rounded-xl border-2 border-green-200" placeholder="z. B. Correction / Event" value={note} onChange={(e)=>setNote(e.target.value)} />
      </div>
      <div className="sm:col-span-5 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Wert: <b>+{pts}</b> Punkte</span>
        <Button onClick={()=> onGrant({ userId: uid, type, date, note, points: pts })} className="rounded-xl bg-green-500 hover:bg-green-600 text-white">Buchen</Button>
      </div>
    </div>
  );
}

function UserManagementTable({ users, onUpdateUser, onResetPw, onAdjustPoints }: any) {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u:any)=> `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Search className="size-4 text-muted-foreground"/>
        <Input placeholder="User suchen…" value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>E-Mail</TableHead>
            <TableHead className="text-right">Punkte</TableHead>
            <TableHead className="text-right">Aktion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((u:any)=> (
            <TableRow key={u.id}>
              <TableCell>{u.firstName} {u.lastName}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell className="text-right">{u.totalPoints}</TableCell>
              <TableCell className="text-right space-x-2">
                <EditUserDialog user={u} onSave={onUpdateUser} />
                <AdjustPointsDialog user={u} onAdjust={onAdjustPoints} />
                <ResetPwDialog user={u} onReset={onResetPw} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EditUserDialog({ user, onSave }: any) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirst] = useState(user.firstName);
  const [lastName, setLast] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="rounded-xl"><Edit3 className="mr-1 size-4"/>Bearbeiten</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User bearbeiten</DialogTitle>
          <DialogDescription>Name & E-Mail anpassen</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div><Label>Vorname</Label><Input className="mt-1" value={firstName} onChange={(e)=>setFirst(e.target.value)} /></div>
          <div><Label>Name</Label><Input className="mt-1" value={lastName} onChange={(e)=>setLast(e.target.value)} /></div>
          <div><Label>E-Mail</Label><Input className="mt-1" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-xl">Abbrechen</Button>
            <Button onClick={()=> { onSave(user.id, { firstName, lastName, email }); setOpen(false); }} className="rounded-xl bg-green-500 text-white hover:bg-green-600">Speichern</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResetPwDialog({ user, onReset }: any) {
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="rounded-xl"><RotateCcw className="mr-1 size-4"/>Passwort</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Passwort zurücksetzen</DialogTitle>
          <DialogDescription>Ein neues temporäres Passwort setzen</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div><Label>Neues Passwort</Label><Input className="mt-1" value={pw} onChange={(e)=>setPw(e.target.value)} placeholder="••••••" /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-xl">Abbrechen</Button>
            <Button onClick={()=> { onReset(user.id, pw); setOpen(false); }} className="rounded-xl bg-green-500 text-white hover:bg-green-600">Setzen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdjustPointsDialog({ user, onAdjust }: any) {
  const [open, setOpen] = useState(false);
  const [delta, setDelta] = useState(0);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm" className="rounded-xl"><PlusCircle className="mr-1 size-4"/>Punkte ±</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Punkte verändern</DialogTitle>
          <DialogDescription>Positive Zahl = Gutschrift, negative = Abzug</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div><Label>Delta</Label><Input type="number" className="mt-1" value={delta} onChange={(e)=>setDelta(parseInt(e.target.value||"0"))} /></div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-xl">Abbrechen</Button>
            <Button onClick={()=> { onAdjust(user.id, delta); setOpen(false); }} className="rounded-xl bg-green-500 text-white hover:bg-green-600">Buchen</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChallengeForm({ onCreate }: any) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [points, setPoints] = useState(30);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  return (
    <form className="grid gap-2" onSubmit={e=>{e.preventDefault(); onCreate({id:Math.random().toString(36).slice(2), name, description:desc, points, from, to}); setName(""); setDesc(""); setPoints(30); setFrom(""); setTo("");}}>
      <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <Textarea placeholder="Beschreibung" value={desc} onChange={e=>setDesc(e.target.value)} />
      <Input type="number" placeholder="Punkte" value={points} onChange={e=>setPoints(parseInt(e.target.value||"0"))} />
      <div className="flex gap-2">
        <Input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={e=>setTo(e.target.value)} />
      </div>
      <Button type="submit" className="bg-green-500 text-white rounded-xl">Challenge erstellen</Button>
    </form>
  );
}

function LoginScreen({ onLogin }: any) {
  const [role, setRole] = useState<"user"|"admin">("user");
  const [email, setEmail] = useState("max@example.com");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="w/full max-w-md rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LogIn className="size-5 text-green-600"/>Anmelden</CardTitle>
          <CardDescription>Rolle wählen & einloggen (Demo)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div>
            <Label>Rolle</Label>
            <Select value={role} onValueChange={(v: "user" | "admin") => setRole(v)}>
              <SelectTrigger className="w-full mt-1 rounded-xl border-2 border-green-300"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>E-Mail</Label><Input className="mt-1 rounded-xl border-2 border-green-200" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" /></div>
          <div><Label>Passwort</Label><Input className="mt-1 rounded-xl border-2 border-green-200" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••" /></div>
          <Button onClick={()=> onLogin({ role, email })} className="rounded-xl bg-green-500 hover:bg-green-600 text-white">Anmelden</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Root App =====
export default function BonusprogrammMockup() {
  const [auth, setAuth] = useState<{ role: null | "user" | "admin"; email?: string }>({ role: null });
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [userProfile, setUserProfile] = useState(seedUserProfile);
  const [users, setUsers] = useState(seedUsers);
  const [queues, setQueues] = useState(seedQueues);
  const [challenges, setChallenges] = useState(seedChallenges);

  // --- Approval actions (points)
  function approvePR(id: string) {
    const req = queues.pointRequests.find((r: any) => r.id === id); if (!req) return;
    const pts = POINT_RULES[req.type as keyof typeof POINT_RULES].points;
    if (req.user === userProfile.name) {
      setUserProfile((u:any) => ({ ...u, totalPoints: u.totalPoints + pts, ledger: [...u.ledger, { id, date: req.date, points: pts, rule: req.type, note: req.note }] }));
    }
    setUsers((arr:any)=> arr.map((u:any)=> `${u.firstName} ${u.lastName}`===req.user ? { ...u, totalPoints: u.totalPoints + pts } : u ));
    setQueues((q:any) => ({ ...q, pointRequests: q.pointRequests.filter((r: any) => r.id !== id) }));
  }
  function rejectPR(id: string) { setQueues((q:any) => ({ ...q, pointRequests: q.pointRequests.filter((r: any) => r.id !== id) })); }

  // --- Approval actions (challenge submissions)
  function approveChallenge(subId: string) {
    const sub = queues.challengeSubmissions.find((s:any)=>s.id===subId); if(!sub) return;
    // credit points
    const pts = sub.challenge.points;
    if (sub.user === userProfile.name) {
      setUserProfile((u:any)=> ({ ...u, totalPoints: u.totalPoints + pts, ledger: [...u.ledger, { id: subId, date: new Date().toISOString().slice(0,10), points: pts, rule: "SPECIAL_EVENT", note: `Challenge: ${sub.challenge.name}` }] }));
    }
    setUsers((arr:any)=> arr.map((u:any)=> `${u.firstName} ${u.lastName}`===sub.user ? { ...u, totalPoints: u.totalPoints + pts } : u ));
    setQueues((q:any)=> ({ ...q, challengeSubmissions: q.challengeSubmissions.filter((s:any)=> s.id!==subId) }));
  }

  // --- Voucher issue
  function issueVoucher(id: string, code: string) {
    setQueues((q:any) => ({ ...q, voucherRequests: q.voucherRequests.filter((r: any) => r.id !== id) }));
    setUserProfile((u:any) => ({ ...u, vouchers: [...u.vouchers, { id: id, label: "NEU", status: "issued", code, issued_at: new Date().toISOString().slice(0,10), expires_at: "2026-09-11" }] }));
  }

  // --- Admin direct grant
  function grantPoints({ userId, type, date, note, points }: any) {
    const target = users.find((u:any)=>u.id===userId); if(!target) return;
    if (`${target.firstName} ${target.lastName}` === userProfile.name) {
      setUserProfile((u:any)=> ({ ...u, totalPoints: u.totalPoints + points, ledger: [...u.ledger, { id: Math.random().toString(36).slice(2), date, points, rule: type, note }] }));
    }
    setUsers((arr:any)=> arr.map((u:any)=> u.id===userId ? { ...u, totalPoints: u.totalPoints + points } : u));
  }

  // --- Admin user mgmt
  function updateUser(userId: string, fields: any) {
    setUsers((arr:any)=> arr.map((u:any)=> u.id===userId ? { ...u, ...fields } : u));
    if (userProfile.id === userId) {
      const name = `${fields.firstName ?? userProfile.name.split(" ")[0]} ${fields.lastName ?? userProfile.name.split(" ")[1] ?? ""}`.trim();
      setUserProfile((up:any)=> ({ ...up, name, email: fields.email ?? up.email }));
    }
  }
  function resetPassword(_userId: string, _newPw: string) { /* mock */ }
  function adjustPoints(userId: string, delta: number) {
    setUsers((arr:any)=> arr.map((u:any)=> u.id===userId ? { ...u, totalPoints: u.totalPoints + delta } : u));
    if (userProfile.id === userId) setUserProfile((u:any)=> ({ ...u, totalPoints: Math.max(0, u.totalPoints + delta) }));
  }

  // --- Challenge lifecycle
  function submitChallenge(id:string) {
    const c = challenges.find((ch:any)=>ch.id===id); if(!c) return;
    setQueues((q:any)=>({...q, challengeSubmissions:[...q.challengeSubmissions, {id:Math.random().toString(36).slice(2), user:userProfile.name, challenge:c, status:"pending"}]}));
  }
  function createChallenge(c:any) { setChallenges((arr:any)=>[...arr,c]); }

  const loggedIn = auth.role !== null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-yellow-50 font-sans">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-green-100 flex items-center justify-center"><Medal className="size-6 text-green-600"/></div>
            <div>
              <div className="font-bold text-green-700">All in Sport Bonus</div>
              <div className="text-xs text-slate-500">Spielerisch belohnen</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loggedIn && (
              <>
                {auth.role === "admin" && <Button variant={mode === "admin" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("admin")} >Admin</Button>}
                <Button variant={mode === "user" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("user")} >User</Button>
                <Button variant="outline" className="rounded-xl" onClick={()=> { setAuth({ role: null }); setMode("user"); }}><LogOut className="mr-2 size-4"/>Abmelden</Button>
              </>
            )}
            {!loggedIn && (
              <Button className="rounded-xl bg-green-500 text-white hover:bg-green-600" onClick={()=> setAuth({ role: "user", email: "max@example.com" })}><LogIn className="mr-2 size-4"/>Schnell-Login</Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {!loggedIn ? (
          <LoginScreen onLogin={({ role, email }: any)=> { setAuth({ role, email }); }} />
        ) : mode === "user" ? (
          <UserDashboard user={userProfile} allUsers={users} challenges={challenges} onSubmitChallenge={submitChallenge} />
        ) : (
          <AdminDashboard
            queues={queues}
            challenges={challenges}
            users={users}
            onApprovePR={approvePR}
            onRejectPR={rejectPR}
            onIssueVoucher={issueVoucher}
            onApproveChallenge={approveChallenge}
            onGrantPoints={grantPoints}
            onUpdateUser={updateUser}
            onResetPw={resetPassword}
            onAdjustPoints={adjustPoints}
            onCreateChallenge={createChallenge}
          />
        )}
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400">
        Demo-Mockup • Duolingo Style • © 2025 All in Sport
      </footer>
    </div>
  );
}
