import { StatusBadge, type StatusTone } from "./status-badge";

export type AuditEvent = {
  id: string;
  timestamp: string; // ISO date
  actor: string;
  actorRole: "Talent" | "UMKM" | "Admin" | "System";
  action: string;
  description: string;
  platformReference?: string;
  externalReference?: string;
  tone?: StatusTone;
};

type AuditTimelineProps = {
  events: AuditEvent[];
  title?: string;
};

export function AuditTimeline({
  events,
  title = "Riwayat & Audit Log Transaksi",
}: AuditTimelineProps) {
  if (events.length === 0) {
    return <p className="audit-timeline__empty">Belum ada catatan aktivitas tercatat.</p>;
  }

  return (
    <div className="audit-timeline">
      <h3 className="audit-timeline__title">{title}</h3>
      <ol className="audit-timeline__list">
        {events.map((event) => (
          <li key={event.id} className="audit-timeline__item">
            <div className="audit-timeline__marker" aria-hidden="true" />
            <div className="audit-timeline__content">
              <div className="audit-timeline__header">
                <span className="audit-timeline__action">{event.action}</span>
                <StatusBadge tone={event.tone ?? "neutral"}>
                  {event.actorRole}: {event.actor}
                </StatusBadge>
              </div>
              <p className="audit-timeline__desc">{event.description}</p>
              <div className="audit-timeline__meta">
                <time dateTime={event.timestamp}>
                  {new Date(event.timestamp).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
                {event.platformReference && (
                  <span className="audit-timeline__ref">
                    Ref: <code>{event.platformReference}</code>
                  </span>
                )}
                {event.externalReference && (
                  <span className="audit-timeline__ref">
                    Ext: <code>{event.externalReference}</code>
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
