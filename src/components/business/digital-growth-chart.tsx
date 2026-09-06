"use client";

import React from "react";
import type { PillarGrowth } from "@/src/modules/business/digital-growth";

type DigitalGrowthChartProps = {
  pillars: PillarGrowth[];
  hasGrowth: boolean;
};

export function DigitalGrowthChart({ pillars, hasGrowth }: DigitalGrowthChartProps) {
  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-6 text-center text-[#53647A] text-sm bg-[#F8FAFC] rounded-xl border border-[#D8E1EE]">
        Belum ada data pilar kesiapan yang dapat dibandingkan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8E1EE]">
        <div>
          <h3 className="text-base font-bold text-[#001040]">Evaluasi 5 Pilar Kesiapan Usaha</h3>
          <p className="text-xs text-[#53647A] mt-0.5">
            Perbandingan tingkat adopsi sebelum kolaborasi proyek vs kondisi terkini.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[#53647A]">
            <span className="w-3 h-3 rounded-sm bg-[#9AABC2]" />
            <span>Skor Awal (Baseline)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#001040]">
            <span className="w-3 h-3 rounded-sm bg-[#006FE6]" />
            <span>Skor Saat Ini (Terkini)</span>
          </div>
        </div>
      </div>

      {/* 5-Pillar Bars */}
      <div className="space-y-5">
        {pillars.map((p) => {
          const beforeWidth = Math.min(Math.max(p.before, 0), 100);
          const afterWidth = Math.min(Math.max(p.after, 0), 100);

          return (
            <div key={p.key} className="space-y-1.5" data-pillar={p.key}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="text-sm font-bold text-[#001040]">{p.label}</span>
                  <span className="text-xs text-[#53647A] block sm:inline sm:ml-2">
                    {p.description}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono tabular-nums text-[#53647A]">
                    {p.before} &rarr;{" "}
                    <strong className="text-[#001040] font-bold">{p.after}</strong>/100
                  </span>

                  {hasGrowth && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border tabular-nums ${
                        p.delta > 0
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : p.delta < 0
                          ? "bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]"
                          : "bg-[#F1F5FB] text-[#53647A] border-[#D8E1EE]"
                      }`}
                    >
                      {p.delta > 0 ? `+${p.delta}` : p.delta}
                    </span>
                  )}
                </div>
              </div>

              {/* Visual Bars Container */}
              <div
                className="relative h-6 bg-[#F1F5FB] rounded-lg p-1 overflow-hidden flex flex-col justify-center gap-0.5"
                role="meter"
                aria-label={`${p.label}: skor awal ${p.before}, skor saat ini ${p.after}. ${
                  p.delta > 0 ? `Naik ${p.delta} poin.` : "Stabil."
                }`}
                aria-valuenow={p.after}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {/* Current Score Bar */}
                <div
                  className="h-2 rounded bg-[#006FE6] transition-all duration-700 ease-out"
                  style={{ width: `${afterWidth}%` }}
                />

                {/* Baseline Bar */}
                <div
                  className="h-1.5 rounded bg-[#9AABC2] transition-all duration-700 ease-out opacity-80"
                  style={{ width: `${beforeWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
