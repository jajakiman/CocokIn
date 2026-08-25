type Step = {
  id: string;
  label: string;
};

type StepProgressProps = {
  steps: Step[];
  currentStepIndex: number;
};

export function StepProgress({ steps, currentStepIndex }: StepProgressProps) {
  return (
    <nav aria-label="Progress alur langkah" className="step-progress">
      <ol className="step-progress__list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const status = isCompleted ? "completed" : isCurrent ? "current" : "upcoming";

          return (
            <li
              key={step.id}
              className="step-progress__item"
              data-status={status}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="step-progress__marker" aria-hidden="true">
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className="step-progress__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
