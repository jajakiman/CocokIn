/**
 * CocokIn Clock Abstraction
 * 
 * Provides deterministic time manipulation for testing:
 * - 24-hour verification token expiry.
 * - 24-hour / 72-hour payment reconciliation timeouts.
 * - 30-day warranty retention period.
 * - Monthly maintenance ticket quota resets.
 */

export interface Clock {
  now(): Date;
  nowIso(): string;
  nowTimestamp(): number;
}

/**
 * Standard system clock using actual system time.
 */
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }

  nowIso(): string {
    return this.now().toISOString();
  }

  nowTimestamp(): number {
    return this.now().getTime();
  }
}

/**
 * Mockable clock for unit and integration testing.
 * Allows freezing and advancing time predictably.
 */
export class FrozenClock implements Clock {
  private currentTime: Date;

  constructor(initialTime?: Date | string | number) {
    this.currentTime = initialTime ? new Date(initialTime) : new Date();
  }

  now(): Date {
    return new Date(this.currentTime.getTime());
  }

  nowIso(): string {
    return this.now().toISOString();
  }

  nowTimestamp(): number {
    return this.now().getTime();
  }

  setTime(time: Date | string | number): void {
    this.currentTime = new Date(time);
  }

  advanceMs(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }

  advanceMinutes(minutes: number): void {
    this.advanceMs(minutes * 60 * 1000);
  }

  advanceHours(hours: number): void {
    this.advanceMs(hours * 60 * 60 * 1000);
  }

  advanceDays(days: number): void {
    this.advanceMs(days * 24 * 60 * 60 * 1000);
  }
}

export const systemClock = new SystemClock();
