export const SECONDS_IN_A_MINUTE = 60;
export const MINUTES_IN_AN_HOUR = 60;
export const HOURS_IN_A_DAY = 24;
export const DAYS_IN_A_YEAR = 365.25;
export const SECONDS_IN_A_YEAR =
  DAYS_IN_A_YEAR * HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR * SECONDS_IN_A_MINUTE;
export const WEEKS_IN_A_YEAR = 52;
export const MONTHS_IN_A_YEAR = 12;

export const SECONDS_IN_A_HOUR = SECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR;
export const SECONDS_IN_A_DAY = SECONDS_IN_A_MINUTE * MINUTES_IN_AN_HOUR * HOURS_IN_A_DAY;
export const SECONDS_IN_A_WEEK = SECONDS_IN_A_YEAR / WEEKS_IN_A_YEAR;
export const SECONDS_IN_A_MONTH = SECONDS_IN_A_YEAR / MONTHS_IN_A_YEAR;

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
