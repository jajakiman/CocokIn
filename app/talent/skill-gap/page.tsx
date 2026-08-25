import { AppShell } from "@/src/design-system/app-shell";
import { SkillGapChart } from "@/src/components/talent/skill-gap-chart";

export default function SkillGapPage() {
  // Fixture data — akan diganti dengan real data dari assessment context/server state
  const mockScores = [
    { skillId: "html", name: "HTML", talentScore: 90 },
    { skillId: "css", name: "CSS", talentScore: 70 },
    { skillId: "javascript", name: "JavaScript", talentScore: 50 },
    { skillId: "react", name: "React", talentScore: 60 },
    { skillId: "tailwind", name: "Tailwind CSS", talentScore: 55 },
    { skillId: "nextjs", name: "Next.js", talentScore: 30 },
  ];

  return (
    <AppShell role="talent">
      <SkillGapChart careerId="frontend-dev" scores={mockScores} />
    </AppShell>
  );
}
