import { AppShell } from "@/src/design-system/app-shell";
import { PortfolioView } from "@/src/components/talent/portfolio-view";
import { createSeededPortfolioEntries } from "@/src/fixtures/seeded-demo";

export default function TalentPortfolioPage() {
  return (
    <AppShell role="talent">
      <PortfolioView initialEntries={createSeededPortfolioEntries()} />
    </AppShell>
  );
}
