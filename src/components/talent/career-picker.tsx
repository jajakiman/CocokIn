import type { CareerDomainId } from "@/src/modules/talent/types";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";
import { Code, Palette, ChartBar, Megaphone } from "@phosphor-icons/react";

type CareerPickerProps = {
  onSelect: (careerId: CareerDomainId) => void;
  selected?: CareerDomainId;
};

function renderCareerIcon(id: CareerDomainId) {
  switch (id) {
    case "fullstack-dev":
      return <Code size={32} weight="duotone" className="text-primary" />;
    case "ui-ux-designer":
      return <Palette size={32} weight="duotone" className="text-primary" />;
    case "data-analyst":
      return <ChartBar size={32} weight="duotone" className="text-primary" />;
    case "digital-marketer":
      return <Megaphone size={32} weight="duotone" className="text-primary" />;
  }
}

export function CareerPicker({ onSelect, selected }: CareerPickerProps) {
  const careers = Object.values(CAREER_TAXONOMY);

  return (
    <div className="career-picker">
      <h2>Pilih Target Karier</h2>
      <p className="career-picker__description">
        Pilih jalur profesi yang ingin kamu tekuni. Soal asesmen dan kurasi proyek mikro akan
        disesuaikan secara otomatis.
      </p>
      <div className="career-picker__grid">
        {careers.map((career) => (
          <button
            type="button"
            key={career.id}
            className="career-card"
            data-selected={selected === career.id}
            onClick={() => onSelect(career.id)}
          >
            <div className="career-card__icon-header" style={{ marginBottom: "0.85rem" }}>
              {renderCareerIcon(career.id)}
            </div>
            <h3>{career.label}</h3>
            <p className="career-card__skills">
              {career.technicalSkills.length} technical skills • {career.softSkills.length} soft skills
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
