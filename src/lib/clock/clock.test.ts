import { describe, it, expect } from "vitest";
import { SystemClock, FrozenClock, systemClock } from "./clock";

describe("Clock Library (src/lib/clock)", () => {
  describe("SystemClock", () => {
    it("returns valid date and ISO string", () => {
      const clock = new SystemClock();
      const before = Date.now();
      const now = clock.now();
      const after = Date.now();

      expect(now.getTime()).toBeGreaterThanOrEqual(before);
      expect(now.getTime()).toBeLessThanOrEqual(after);
      expect(typeof clock.nowIso()).toBe("string");
      expect(clock.nowTimestamp()).toBeGreaterThan(0);
    });

    it("singleton systemClock is accessible", () => {
      expect(systemClock.now()).toBeInstanceOf(Date);
    });
  });

  describe("FrozenClock", () => {
    it("freezes time at specific date", () => {
      const fixed = new Date("2026-09-01T12:00:00.000Z");
      const clock = new FrozenClock(fixed);

      expect(clock.now().toISOString()).toBe("2026-09-01T12:00:00.000Z");
      expect(clock.nowIso()).toBe("2026-09-01T12:00:00.000Z");
      expect(clock.nowTimestamp()).toBe(fixed.getTime());
    });

    it("advances hours and days predictably for SLA testing", () => {
      const start = new Date("2026-09-01T00:00:00.000Z");
      const clock = new FrozenClock(start);

      // Advance 24 hours (e.g. payment timeout)
      clock.advanceHours(24);
      expect(clock.now().toISOString()).toBe("2026-09-02T00:00:00.000Z");

      // Advance 30 days (e.g. warranty retention period)
      clock.advanceDays(30);
      expect(clock.now().toISOString()).toBe("2026-10-02T00:00:00.000Z");
    });

    it("allows explicitly setting time", () => {
      const clock = new FrozenClock("2026-01-01T00:00:00.000Z");
      clock.setTime("2026-12-31T23:59:59.999Z");
      expect(clock.now().toISOString()).toBe("2026-12-31T23:59:59.999Z");
    });
  });
});
