import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 30 }, (_, i) => ({
  d: i,
  v: 40 + Math.sin(i / 3) * 12 + i * 1.8 + (i > 18 ? (i - 18) * 2 : 0),
}));

const platformData = [
  { name: "Instagram", v: 92 },
  { name: "LinkedIn", v: 74 },
  { name: "Meta Ads", v: 86 },
  { name: "Google Ads", v: 64 },
];

export function LiveDashboard({ compact = false }: { compact?: boolean }) {
  return (
    <div className="glass-panel relative flex flex-col gap-4 overflow-hidden p-6 w-full h-full">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-block size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">Live performance</span>
        </div>
        <span className="text-[10px] text-text-tertiary">Updated 2m ago</span>
      </div>

      {/* primary chart */}
      <div className="h-36 w-full sm:h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 0, top: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="brandFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-rose)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--brand-red)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="brandStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--brand-pink)" />
                <stop offset="100%" stopColor="var(--brand-deep)" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="d" hide />
            <YAxis hide domain={["dataMin - 5", "dataMax + 10"]} />
            <Area
              type="monotone"
              dataKey="v"
              stroke="url(#brandStroke)"
              strokeWidth={2}
              fill="url(#brandFill)"
              isAnimationActive
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* metric tiles */}
      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="Audience Growth" value="+24.6%" />
        <MetricTile label="Engagement Rate" value="8.2%" />
        <MetricTile label="Ad Volume" value="1,284" />
        <MetricTile label="Conversion Rate" value="4.7%" />
      </div>

      {/* platform performance */}
      {!compact && (
        <div className="space-y-4 rounded-xl border border-white/[0.05] bg-white/[0.01] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">Platform performance</span>
            <span className="text-[10px] text-text-tertiary">Last 30 days</span>
          </div>
          <div className="space-y-3">
            {platformData.map((p) => (
              <div key={p.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-secondary font-medium">{p.name}</span>
                  <span className="text-text-primary font-semibold">{p.v}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-brand transition-all duration-1000"
                    style={{ width: `${p.v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.01] p-4 transition-all duration-300 hover:border-white/[0.08] hover:bg-white/[0.02]">
      <div className="text-[11px] font-medium text-text-secondary leading-none">{label}</div>
      <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-text-primary num-tabular">
        {value}
      </div>
    </div>
  );
}
