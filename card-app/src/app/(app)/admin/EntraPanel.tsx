import { entraStatus } from "@/lib/entra";
import { syncEntraNow } from "./actions";

export async function EntraPanel() {
  const s = await entraStatus();
  if (!s.configured) {
    return (
      <div className="card stack-sm">
        <h2>Microsoft Entra ID</h2>
        <p className="small muted">
          Not connected. Once it is, cards are made automatically on a new hire's start date, and accounts are archived as soon as someone is turned off in Microsoft 365. Setup steps are in the README under "Microsoft Entra ID".
        </p>
      </div>
    );
  }
  const r = s.lastRun;
  const subOk = s.subscription && new Date(s.subscription.expires) > new Date();
  return (
    <div className="card stack-sm">
      <div className="row between">
        <h2>Microsoft Entra ID</h2>
        <form action={syncEntraNow}><button className="btn secondary sm">Sync now</button></form>
      </div>
      <div className="row small">
        <span className="badge ok">Connected</span>
        <span className={`badge ${subOk ? "ok" : "warn"}`}>{subOk ? "Live updates on" : "Live updates off, scheduled sync only"}</span>
        <span className="muted">{s.linked} people linked{s.group ? " · limited to one group" : ""}</span>
      </div>
      {r ? (
        <p className="small">
          Last sync {new Date(r.at).toLocaleString()} ({r.trigger}): {r.created} new, {r.activated} started, {r.updated} updated, {r.archived} archived, {r.restored} restored.
          {r.errors.length > 0 && <span style={{ color: "var(--red-500)" }}> {r.errors.length} errors: {r.errors[0]}</span>}
        </p>
      ) : (
        <p className="small muted">No sync has run yet. Click Sync now to import everyone.</p>
      )}
    </div>
  );
}
