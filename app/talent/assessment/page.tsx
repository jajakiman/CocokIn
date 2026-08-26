import { AppShell } from "@/src/design-system/app-shell";
import { AssessmentWizard } from "@/src/components/talent/assessment-wizard";

export default function AssessmentPage() {
  return (
    <AppShell role="talent">
      <AssessmentWizard />
    </AppShell>
  );
}
