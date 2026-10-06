"use client";
import { useState } from "react";

// Single series daily bar chart. Thin bars, 4px rounded tops anchored to the
// baseline, 2px gaps, recessive grid, hover readout above the plot.
export function BarChart({ data, label, height = 180 }: { data: { date: string; value: number }[]; label: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = height;
  const padL = 32, padB = 22, padT = 8;
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = max <= 10 ? Math.max(2, Math.ceil(max / 2) * 2) : Math.ceil(max / 10) * 10;
  const plotW = W - padL, plotH = H - padB - padT;
  const step = plotW / Math.max(1, data.length);
  const bw = Math.max(2, Math.min(18, step - 2));
  const y = (v: number) => padT + plotH - (v / nice) * plotH;
  const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const total = data.reduce((n, d) => n + d.value, 0);
  const tickEvery = Math.ceil(data.length / 6);
  const h = hover != null ? data[hover] : null;
  return (
    <figure style={{ margin: 0 }}>
      <div className="row between" style={{ marginBottom: 4 }}>
        <span className="small" style={{ fontWeight: 600, color: "var(--text-strong)" }}>{label}</span>
        <span className="chart-tip">{h ? `${fmt(h.date)}: ${h.value}` : `${total} total`}</span>
      </div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}, ${total} total`} onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line x1={padL} x2={W} y1={y(nice * f)} y2={y(nice * f)} stroke="var(--gray-100)" strokeWidth={1} />
            <text x={padL - 6} y={y(nice * f) + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">{Math.round(nice * f)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + i * step + (step - bw) / 2;
          const top = y(d.value);
          const hgt = padT + plotH - top;
          const r = Math.min(4, bw / 2, hgt);
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>
              <rect x={padL + i * step} y={padT} width={step} height={plotH} fill="transparent" />
              {d.value > 0 && (
                <path
                  d={`M${x},${padT + plotH} V${top + r} Q${x},${top} ${x + r},${top} H${x + bw - r} Q${x + bw},${top} ${x + bw},${top + r} V${padT + plotH} Z`}
                  fill={hover === i ? "var(--rhm-navy)" : "var(--rhm-blue)"}
                />
              )}
              {i % tickEvery === 0 && (
                <text x={padL + i * step + step / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--text-muted)">{fmt(d.date)}</text>
              )}
            </g>
          );
        })}
        <line x1={padL} x2={W} y1={padT + plotH} y2={padT + plotH} stroke="var(--gray-300)" strokeWidth={1} />
      </svg>
    </figure>
  );
}
