import { describe, expect, it } from "vitest";

import { mapQuestionRecords } from "./catalog";

describe("assessment catalog mapping", () => {
  it("maps ordered database rows to assessment questions", () => {
    expect(mapQuestionRecords([{
      id: "q-1",
      audience: "TALENT",
      kind: "TECHNICAL",
      careerKey: "fullstack-dev",
      skillKey: "javascript",
      pillar: null,
      text: "Pertanyaan",
      position: 1,
      isActive: true,
      options: [
        { id: "o-2", label: "B", score: 0, position: 2 },
        { id: "o-1", label: "A", score: 100, position: 1 },
      ],
    }])).toEqual([{
      id: "q-1",
      careerId: "fullstack-dev",
      type: "TECHNICAL",
      skillId: "javascript",
      text: "Pertanyaan",
      options: [
        { id: "o-1", label: "A", score: 100 },
        { id: "o-2", label: "B", score: 0 },
      ],
    }]);
  });
});
