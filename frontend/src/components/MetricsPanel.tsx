import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { Code2, GitCommit, Network } from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface MetricsPanelProps {
    result: AnalysisResult;
}

const RADIAN = Math.PI / 180;

interface PieLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) {
    if (percent < 0.06) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

interface PieTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: { name: string; color: string } }>;
}

function CustomPieTooltip({ active, payload }: PieTooltipProps) {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
            <span className="font-semibold" style={{ color: d.payload.color }}>
                {d.payload.name}
            </span>
            <span className="text-muted-foreground ml-2">{d.value}%</span>
        </div>
    );
}

interface BarTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

function CustomBarTooltip({ active, payload, label }: BarTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass rounded-lg px-3 py-2 text-xs shadow-xl">
            <p className="text-muted-foreground">{label}</p>
            <p className="font-semibold text-primary">{payload[0].value} commits</p>
        </div>
    );
}

export function MetricsPanel({ result }: MetricsPanelProps) {
    return (
        <div className="h-full overflow-y-auto p-4 space-y-6">

            {/* ── Languages Donut ────────────────────────────────── */}
            <section className="glass rounded-xl p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Code2 className="w-3.5 h-3.5" />
                    Languages
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={result.languages}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            dataKey="percentage"
                            labelLine={false}
                            label={renderCustomLabel}
                        >
                            {result.languages.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {result.languages.map((lang) => (
                        <span key={lang.name} className="flex items-center gap-1.5 text-xs">
                            <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-muted-foreground">{lang.name}</span>
                            <span className="text-foreground font-medium">{lang.percentage}%</span>
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Commit Activity Bar ────────────────────────────── */}
            <section className="glass rounded-xl p-4 space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <GitCommit className="w-3.5 h-3.5" />
                    Commit Activity
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                        data={result.commits}
                        margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 14%)" />
                        {/* dataKey="month" matches API: { month: string, count: number } */}
                        <XAxis dataKey="month" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} />
                        <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} />
                        <Tooltip content={<CustomBarTooltip />} />
                        {/* dataKey="count" matches API spec */}
                        <Bar
                            dataKey="count"
                            fill="hsl(217 91% 60%)"
                            radius={[4, 4, 0, 0]}
                            opacity={0.9}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            {/* ── Architecture Diagram ───────────────────────────── */}
            {result.architectureDiagram && (
                <section className="glass rounded-xl p-4 space-y-2">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Network className="w-3.5 h-3.5" />
                        Architecture
                    </h3>
                    {/* Rendered as a styled code block — never evaluated */}
                    <pre className="text-xs text-foreground/75 leading-relaxed whitespace-pre-wrap break-words font-mono bg-secondary/40 rounded-lg p-3 overflow-x-auto">
                        <code>{result.architectureDiagram}</code>
                    </pre>
                </section>
            )}
        </div>
    );
}
