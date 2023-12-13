export function parseTime(timeString: string): string {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0'); // Get hours and pad with 0 if needed
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with 0 if needed
  return `${hours}:${minutes}`;
}