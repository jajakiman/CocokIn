import type { CareerDomainId } from "@/src/modules/talent/types";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

type CareerPickerProps = {
  onSelect: (careerId: CareerDomainId) => void;
  selected?: CareerDomainId;
};

export function CareerPicker({ onSelect, selected }: CareerPickerProps) {
  const careers = Object.values(CAREER_TAXONOMY);

  return (
    <div className="career-picker">
      <h2>Pilih Target Karier</h2>
      <p className="career-picker__description">
        Pilih jalur karier yang ingin kamu tekuni. Asesmen akan disesuaikan dengan pilihan ini.
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
            <h3>{career.label}</h3>
            <p className="career-card__skills">
              {career.technicalSkills.length} technical skills •{" "}
              {career.softSkills.length} soft skills
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
