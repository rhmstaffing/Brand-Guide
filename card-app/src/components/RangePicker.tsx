import Link from "next/link";

export function RangePicker({ current, base, extra = "" }: { current: string; base: string; extra?: string }) {
  const opts: [string, string][] = [["7", "7 days"], ["30", "30 days"], ["90", "90 days"], ["365", "1 year"]];
  return (
    <div className="seg">
      {opts.map(([k, l]) => (
        <Link key={k} href={`${base}?range=${k}${extra}`} className={current === k ? "on" : ""}>{l}</Link>
      ))}
    </div>
  );
}
