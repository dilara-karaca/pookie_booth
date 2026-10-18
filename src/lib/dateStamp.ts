export const MAX_CAPTION = 24;

export interface BoothStamp {
  label: string;
  filename: string;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatBoothStamp(date: Date): BoothStamp {
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return {
    label: `${day}.${month}.${year} · ${hours}:${minutes}`,
    filename: `photobooth-${year}-${month}-${day}-${hours}${minutes}.png`,
  };
}

export function sanitizeCaption(input: string): string {
  const collapsed = input.replace(/\s+/g, " ").replace(/^\s/, "");
  return Array.from(collapsed).slice(0, MAX_CAPTION).join("");
}
