import { AppShell } from "@/src/design-system/app-shell";
import { WorkspaceView } from "@/src/components/talent/workspace-view";

export default function TalentWorkspacePage() {
  return (
    <AppShell role="talent">
      <WorkspaceView />
    </AppShell>
  );
}
