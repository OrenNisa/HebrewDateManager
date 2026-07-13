import { HDate } from '@hebcal/core';

export interface HebrewMonthInfo {
  nameEn: string;
  nameHe: string;
  isLeapOnly: boolean;
}

export const HEBREW_MONTHS: HebrewMonthInfo[] = [
  { nameEn: 'Tishrei', nameHe: 'תשרי', isLeapOnly: false },
  { nameEn: 'Cheshvan', nameHe: 'חשוון', isLeapOnly: false },
  { nameEn: 'Kislev', nameHe: 'כסלו', isLeapOnly: false },
  { nameEn: 'Tevet', nameHe: 'טבת', isLeapOnly: false },
  { nameEn: 'Sh\'vat', nameHe: 'שבט', isLeapOnly: false },
  { nameEn: 'Adar', nameHe: 'אדר', isLeapOnly: false },
  { nameEn: 'Adar I', nameHe: 'אדר א׳', isLeapOnly: true },
  { nameEn: 'Adar II', nameHe: 'אדר ב׳', isLeapOnly: true },
  { nameEn: 'Nisan', nameHe: 'ניסן', isLeapOnly: false },
  { nameEn: 'Iyyar', nameHe: 'אייר', isLeapOnly: false },
  { nameEn: 'Sivan', nameHe: 'סיון', isLeapOnly: false },
  { nameEn: 'Tamuz', nameHe: 'תמוז', isLeapOnly: false },
  { nameEn: 'Av', nameHe: 'אב', isLeapOnly: false },
  { nameEn: 'Elul', nameHe: 'אלול', isLeapOnly: false },
];

export const GEMATRIA_DAYS = [
  "", "א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳",
  "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז", "י״ז", "י״ח", "י״ט", "כ׳",
  "כ״א", "כ״ב", "כ״ג", "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל׳"
];

export function getHebrewYearGematria(year: number): string {
  const y = year % 1000; // e.g. 786
  let res = "";
  let temp = y;
  
  if (temp >= 400) {
    res += "ת";
    temp -= 400;
  }
  if (temp >= 300) {
    res += "ש";
    temp -= 300;
  } else if (temp >= 200) {
    res += "ר";
    temp -= 200;
  } else if (temp >= 100) {
    res += "ק";
    temp -= 100;
  }
  
  const tens = Math.floor(temp / 10) * 10;
  const ones = temp % 10;
  
  if (temp === 15) {
    res += "טו";
  } else if (temp === 16) {
    res += "טז";
  } else {
    const tensMap: Record<number, string> = {
      10: "י", 20: "כ", 30: "ל", 40: "מ", 50: "נ", 60: "ס", 70: "ע", 80: "פ", 90: "צ"
    };
    const onesMap: Record<number, string> = {
      1: "א", 2: "ב", 3: "ג", 4: "ד", 5: "ה", 6: "ו", 7: "ז", 8: "ח", 9: "ט"
    };
    if (tensMap[tens]) res += tensMap[tens];
    if (onesMap[ones]) res += onesMap[ones];
  }
  
  if (res.length > 1) {
    return res.slice(0, -1) + '״' + res.slice(-1);
  }
  return res + '׳';
}

export function getHebrewMonthHebrewName(nameEn: string): string {
  const month = HEBREW_MONTHS.find(m => m.nameEn.toLowerCase() === nameEn.toLowerCase());
  return month ? month.nameHe : nameEn;
}

export function formatHebrewDate(day: number, monthEn: string, year: number): string {
  const dayHe = GEMATRIA_DAYS[day] || `${day}`;
  const monthHe = getHebrewMonthHebrewName(monthEn);
  const yearHe = getHebrewYearGematria(year);
  return `${dayHe} ב${monthHe} ${yearHe}`;
}

export function gregorianToHebrew(date: Date, afterSunset: boolean) {
  let targetDate = new Date(date);
  if (afterSunset) {
    // Add 1 day
    targetDate.setDate(targetDate.getDate() + 1);
  }
  
  const hdate = new HDate(targetDate);
  const day = hdate.getDate();
  const monthEn = hdate.getMonthName();
  const year = hdate.getFullYear();
  
  return {
    day,
    monthEn,
    year,
    formatted: formatHebrewDate(day, monthEn, year),
  };
}

export function getHebrewCurrentYear(): number {
  const now = new HDate();
  return now.getFullYear();
}

export function getMonthLength(monthEn: string, year: number): number {
  // Find month length by checking if day 30 normalizes to day 1 of next month
  const d30 = new HDate(30, monthEn, year);
  return d30.getDate() === 30 ? 30 : 29;
}

/**
 * Checks if a Hebrew year is a leap year.
 */
export function isLeapYear(year: number): boolean {
  // In 19-year Metonic cycle, leap years are 3, 6, 8, 11, 14, 17, 19
  const remainder = ((7 * year) + 1) % 19;
  return remainder < 7;
}

export function hebrewToGregorian(day: number, monthEn: string, year: number): Date {
  const hdate = new HDate(day, monthEn, year);
  return hdate.greg();
}

export interface GeneratedOccurrence {
  date: Date;
  hebrewYear: number;
  occurrenceNumber: number; // e.g. age
  formattedHebrewDate: string;
}

export function generateFutureOccurrences(
  day: number,
  monthEn: string,
  startYearHeb: number,
  startNumber: number | undefined,
  totalOccurrences: number
): GeneratedOccurrence[] {
  const occurrences: GeneratedOccurrence[] = [];
  
  for (let i = 0; i < totalOccurrences; i++) {
    const targetYear = startYearHeb + i;
    
    // Create HDate. The library handles leap year mapping (Adar -> Adar II) 
    // and short month mapping (30 Kislev -> 1 Tevet) automatically!
    const hdate = new HDate(day, monthEn, targetYear);
    const actualDay = hdate.getDate();
    const actualMonthEn = hdate.getMonthName();
    const gregDate = hdate.greg();
    
    occurrences.push({
      date: gregDate,
      hebrewYear: targetYear,
      occurrenceNumber: startNumber !== undefined ? startNumber + i : i + 1,
      formattedHebrewDate: formatHebrewDate(actualDay, actualMonthEn, targetYear),
    });
  }
  
  return occurrences;
}

export function toLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getUpcomingHebrewYear(day: number, monthEn: string): number {
  const now = new Date();
  const currentHebrewYear = getHebrewCurrentYear();
  
  // Try the current Hebrew year first
  const eventThisYear = new HDate(day, monthEn, currentHebrewYear);
  const gregThisYear = eventThisYear.greg();
  
  const todayStr = toLocalISOString(now);
  const eventThisYearStr = toLocalISOString(gregThisYear);
  
  if (eventThisYearStr >= todayStr) {
    return currentHebrewYear;
  } else {
    return currentHebrewYear + 1;
  }
}
