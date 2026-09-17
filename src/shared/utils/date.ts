export function addMinutes(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export function addHours(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function addDays(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
