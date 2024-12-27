import { Timestamp } from 'firebase/firestore';

export interface TimeframeRange {
  start: Timestamp;
  end: Timestamp;
}

export function calculateTimeframeRange(timeframe: string): TimeframeRange {
  const now = new Date();
  let start: Date;
  const end = now;

  switch (timeframe) {
    case 'Last 1 Hour':
      start = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case 'Today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'Last 24 Hours':
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'Last Week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      start = new Date(now.getTime() - 60 * 60 * 1000); // Default to Last 1 Hour
  }

  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end)
  };
}

export function formatTimeframeForQuery(range: TimeframeRange): {
  startTime: Timestamp;
  endTime: Timestamp;
} {
  return {
    startTime: range.start,
    endTime: range.end
  };
}

export function getCurrentTimeZoneOffset(): number {
  return new Date().getTimezoneOffset();
}

export function adjustForTimeZone(date: Date, offsetMinutes: number): Date {
  return new Date(date.getTime() - offsetMinutes * 60 * 1000);
}

