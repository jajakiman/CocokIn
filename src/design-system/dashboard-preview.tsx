import Link from "next/link";

import { AppShell } from "./app-shell";
import { MetricTile } from "./metric-tile";
import { getRoleConfig, type AppRole } from "./role-config";
import { StatusBadge, type StatusTone } from "./status-badge";
import { SEEDED_DASHBOARD_FIXTURES } from "@/src/fixtures/seeded-demo";

type DashboardFixture = {
  eyebrow: string;
  title: string;
  description: string;
  sectionTitle: string;
  metrics: Array<{ label: string; value: string; detail: string }>;
  tasks: Array<{ title: string; meta: string; status: string; tone: StatusTone }>;
};

type DashboardPreviewProps = { role: AppRole };

export function DashboardPreview({ role }: DashboardPreviewProps) {
  const config = getRoleConfig(role);
  const fixture = (SEEDED_DASHBOARD_FIXTURES as Record<AppRole, DashboardFixture>)[role];

  return (
    <AppShell role={role}>
      <section className="page-heading">
        <div>
          <p className="eyebrow">{fixture.eyebrow}</p>
          <h1>{fixture.title}</h1>
          <p>{fixture.description}</p>
        </div>
        <Link className="primary-action" href={config.primaryAction.href}>
          {config.primaryAction.label}
        </Link>
      </section>

      <section aria-label="Ringkasan" className="metrics-grid">
        {fixture.metrics.map((metric) => (
          <MetricTile {...metric} key={metric.label} />
        ))}
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>{fixture.sectionTitle}</h2>
          <button className="text-action" type="button">
            Lihat semua
          </button>
        </div>
        <div className="task-list">
          {fixture.tasks.map((task) => (
            <article className="task-row" key={task.title}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.meta}</p>
              </div>
              <StatusBadge tone={task.tone}>{task.status}</StatusBadge>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
