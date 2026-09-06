"use client";

type CompositeScoreDonutProps = {
  technicalScore: number;
  softSkillScore: number;
  compositeScore: number;
  size?: number;
};

export function CompositeScoreDonut({
  technicalScore,
  softSkillScore,
  compositeScore,
  size = 220,
}: CompositeScoreDonutProps) {
  // Formula: Composite = (0.6 * Tech) + (0.4 * Soft)
  const techContribution = Math.round(technicalScore * 0.6);
  const softContribution = Math.round(softSkillScore * 0.4);

  // SVG parameters
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Arc lengths (scaled to circumference based on point contribution out of 100)
  const techArcLength = (techContribution / 100) * circumference;
  const softArcLength = (softContribution / 100) * circumference;

  // Offsets for sequential arcs
  // Arc 1 (Technical) starts at -90deg (top center)
  const techDasharray = `${techArcLength} ${circumference}`;
  const techDashoffset = 0;

  // Arc 2 (Soft Skill) starts immediately after Arc 1
  const softDasharray = `${softArcLength} ${circumference}`;
  const softDashoffset = -techArcLength;

  // Readiness qualification badge
  let readinessBadge = "Kesiapan Terbatas";
  let badgeTone = "text-[#BE123C] bg-[#FFF1F2] border-[#FECDD3]";
  if (compositeScore >= 80) {
    readinessBadge = "Siap Kerja (Tinggi)";
    badgeTone = "text-[#047857] bg-[#ECFDF5] border-[#A7F3D0]";
  } else if (compositeScore >= 60) {
    readinessBadge = "Kesiapan Menengah";
    badgeTone = "text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]";
  }

  const ariaDescription = `Grafik donat kesiapan kerja: Skor Komposit ${compositeScore}%. Kontribusi Teknis ${techContribution} poin dari skor teknis ${technicalScore}%. Kontribusi Soft Skill ${softContribution} poin dari skor soft skill ${softSkillScore}%. Kategori: ${readinessBadge}.`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#D8E1EE] shadow-sm">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90 transform"
          role="img"
          aria-label={ariaDescription}
        >
          {/* Background Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F1F5FB"
            strokeWidth={strokeWidth}
          />

          {/* Technical Arc (60% weight, Blue) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#006FE6"
            strokeWidth={strokeWidth}
            strokeDasharray={techDasharray}
            strokeDashoffset={techDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Soft Skill Arc (40% weight, Orange) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#FF8010"
            strokeWidth={strokeWidth}
            strokeDasharray={softDasharray}
            strokeDashoffset={softDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-4xl sm:text-5xl font-black text-[#001040] tracking-tight tabular-nums">
            {compositeScore}%
          </span>
          <span
            className={`mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeTone}`}
          >
            {readinessBadge}
          </span>
        </div>
      </div>

      {/* Breakdown Legend */}
      <div className="w-full mt-4 pt-4 border-t border-[#D8E1EE] grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#F8FAFC]">
          <div className="flex items-center gap-1.5 font-bold text-[#001040]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006FE6] shrink-0" />
            <span>Porsi Teknis (60%)</span>
          </div>
          <p className="text-[#53647A] mt-0.5 font-medium text-[11px]">
            {technicalScore}% &rarr;{" "}
            <strong className="text-[#006FE6] font-bold">
              {techContribution} poin
            </strong>
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#F8FAFC]">
          <div className="flex items-center gap-1.5 font-bold text-[#001040]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF8010] shrink-0" />
            <span>Soft Skill (40%)</span>
          </div>
          <p className="text-[#53647A] mt-0.5 font-medium text-[11px]">
            {softSkillScore}% &rarr;{" "}
            <strong className="text-[#FF8010] font-bold">
              {softContribution} poin
            </strong>
          </p>
        </div>
      </div>

      {/* Screen reader fallback text */}
      <span className="sr-only">{ariaDescription}</span>
    </div>
  );
}
