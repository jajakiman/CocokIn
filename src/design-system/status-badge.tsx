import type { ReactNode } from "react";

export type StatusTone = "success" | "warning" | "destructive" | "info" | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusTone;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className="status-badge" data-tone={tone}>
      <span aria-hidden="true" className="status-badge__dot" />
      {children}
    </span>
  );
}
