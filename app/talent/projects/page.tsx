import { AppShell } from "@/src/design-system/app-shell";
import { ProjectCatalog } from "@/src/components/talent/project-catalog";

export default function ProjectsPage() {
  return (
    <AppShell role="talent">
      <ProjectCatalog />
    </AppShell>
  );
}
