const cell = (v: unknown) => {
  const s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s; // stop spreadsheet formula injection
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function toCsv(head: string[], rows: unknown[][]): string {
  return [head, ...rows].map((r) => r.map(cell).join(",")).join("\n");
}
