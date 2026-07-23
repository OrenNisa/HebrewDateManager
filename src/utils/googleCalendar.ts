import { generateFutureOccurrences, formatHebrewDate, toLocalISOString } from './hebcal';
import { v4 as uuidv4 } from 'uuid';

const CLIENT_ID_KEY = 'hebrew_calendar_client_id';
const ACCESS_TOKEN_KEY = 'hebrew_calendar_access_token';
const TOKEN_EXPIRY_KEY = 'hebrew_calendar_token_expiry';

export function getStoredClientId(): string {
  const envId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (envId) return envId.trim();
  return localStorage.getItem(CLIENT_ID_KEY) || '';
}

export function setStoredClientId(clientId: string) {
  localStorage.setItem(CLIENT_ID_KEY, clientId);
}

export function getAccessToken(): string {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY) || '';
  const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return '';
  
  // Check if expired
  if (Date.now() > parseInt(expiry, 10)) {
    logout();
    return '';
  }
  return token;
}

export function setAccessToken(token: string, expiresInSeconds: number) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  const expiryTime = Date.now() + expiresInSeconds * 1000;
  sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
}

export function logout() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

/**
 * Custom fetch with retries for handling rate limits (429/403)
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> {
  const token = getAccessToken();
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  const finalOptions = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, finalOptions);
    if (res.status === 401) {
      logout();
      window.dispatchEvent(new Event('auth_change'));
      throw new Error('החיבור ליומן גוגל פג. אנא התחבר מחדש.');
    }
    
    if (res.status === 429 || res.status === 403) {
      const body = await res.clone().json().catch(() => ({}));
      const isRateLimit = 
        res.status === 429 || 
        body.error?.errors?.some((e: any) => e.reason === 'rateLimitExceeded' || e.reason === 'userRateLimitExceeded');
        
      if (isRateLimit && retries > 0) {
        console.warn(`Rate limit encountered, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

export interface CalendarEventPrivateProperties {
  app_stamp: 'hebrew_calendar_app';
  group_id: string;
  hebrew_month: string;
  hebrew_day: string;
  hebrew_year: string;
  start_number?: string;
  original_start_year: string;
}

export interface HebrewEventOccurrence {
  id: string;
  gregorianDateStr: string; // YYYY-MM-DD
  hebrewYear: number;
  occurrenceNumber: number;
  formattedHebrewDate: string;
}

export interface HebrewEventGroup {
  groupId: string;
  name: string;
  hebrewDay: number;
  hebrewMonth: string;
  startNumber?: number;
  originalStartYear: number;
  reminders: number[]; // minutes before
  occurrences: HebrewEventOccurrence[];
}

/**
 * Fetches all events matching our app stamp and groups them by group_id
 */
export interface CorruptEvent {
  id: string;
  summary: string;
  reason: string;
}

/**
 * Fetches all events matching our app stamp and groups them by group_id, separating corrupt ones
 */
export async function fetchHebrewEventGroups(): Promise<{ groups: HebrewEventGroup[]; corruptEvents: CorruptEvent[] }> {
  const groupsMap: Record<string, HebrewEventGroup> = {};
  const corruptEvents: CorruptEvent[] = [];
  let pageToken = '';
  
  do {
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
    url.searchParams.set('privateExtendedProperty', 'app_stamp=hebrew_calendar_app');
    url.searchParams.set('maxResults', '250');
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }
    
    const response = await fetchWithRetry(url.toString(), { method: 'GET' });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || 'שגיאה בטעינת אירועים מיומן גוגל');
    }
    
    const data = await response.json();
    const items = data.items || [];
    
    for (const item of items) {
      const privateProps = item.extendedProperties?.private as CalendarEventPrivateProperties;
      if (!privateProps || privateProps.app_stamp !== 'hebrew_calendar_app') continue;
      
      const groupId = privateProps.group_id;
      const hDay = parseInt(privateProps.hebrew_day, 10);
      const hMonth = privateProps.hebrew_month;
      const hYear = parseInt(privateProps.hebrew_year, 10);
      const originalStartYear = parseInt(privateProps.original_start_year, 10);
      const startNumber = privateProps.start_number ? parseInt(privateProps.start_number, 10) : undefined;
      
      // Verification for corrupt events
      let isCorrupt = false;
      let reason = '';
      
      if (!groupId) {
        isCorrupt = true;
        reason = 'מזהה קבוצה (group_id) חסר';
      } else if (!hMonth || isNaN(hDay) || isNaN(hYear) || isNaN(originalStartYear)) {
        isCorrupt = true;
        reason = 'נתוני תאריך עברי חסרים או לא תקינים';
      }
      
      if (isCorrupt) {
        corruptEvents.push({
          id: item.id,
          summary: item.summary || 'אירוע עברי פגום',
          reason,
        });
        continue;
      }
      
      // Calculate occurrence number
      let occurrenceNumber = hYear - originalStartYear + 1;
      if (startNumber !== undefined) {
        occurrenceNumber = startNumber + (hYear - originalStartYear);
      }
      
      const occurrence: HebrewEventOccurrence = {
        id: item.id,
        gregorianDateStr: item.start.date || item.start.dateTime?.split('T')[0] || '',
        hebrewYear: hYear,
        occurrenceNumber,
        formattedHebrewDate: formatHebrewDate(hDay, hMonth, hYear),
      };
      
      // Reminders parsing
      const remindersOverrides = item.reminders?.overrides || [];
      const reminders = remindersOverrides.map((o: any) => o.minutes);
      
      if (!groupsMap[groupId]) {
        // Clean name (strip parentheses and numbering from calendar display)
        const rawSummary = item.summary || 'אירוע עברי';
        const cleanName = rawSummary.replace(/\s*\(\d+\)\s*$/, '');
        
        groupsMap[groupId] = {
          groupId,
          name: cleanName,
          hebrewDay: hDay,
          hebrewMonth: hMonth,
          startNumber,
          originalStartYear,
          reminders,
          occurrences: [],
        };
      }
      
      groupsMap[groupId].occurrences.push(occurrence);
    }
    
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  
  // Convert map to array and sort occurrences by Hebrew year
  const groups = Object.values(groupsMap).map(group => {
    group.occurrences.sort((a, b) => a.hebrewYear - b.hebrewYear);
    return group;
  });
  
  return { groups, corruptEvents };
}

/**
 * Creates a corrupt test event to help user verify damaged event detection
 */
export async function createCorruptTestEvent(): Promise<void> {
  const dateStr = new Date().toISOString().split('T')[0];
  const body = {
    summary: 'אירוע פגום לדוגמה (בדיקה)',
    description: 'אירוע בדיקה שנוצר ללא מזהה קבוצה כדי לבדוק זיהוי אירועים פגומים.',
    start: { date: dateStr },
    end: { date: dateStr },
    extendedProperties: {
      private: {
        app_stamp: 'hebrew_calendar_app',
        // group_id is intentionally omitted to simulate a corrupt event
      },
    },
  };
  
  const response = await fetchWithRetry('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'שגיאה ביצירת אירוע פגום לבדיקה');
  }
}

/**
 * Creates a series of calendar events (concurrency controlled sequential fetch calls)
 */
export async function createHebrewEventGroup(
  name: string,
  day: number,
  monthEn: string,
  startYearHeb: number,
  startNumber: number | undefined,
  count: number,
  reminders: number[], // minutes before
  onProgress?: (current: number, total: number) => void,
  existingGroupId?: string
): Promise<HebrewEventGroup> {
  const groupId = existingGroupId || uuidv4();
  const occurrencesToCreate = generateFutureOccurrences(day, monthEn, startYearHeb, startNumber, count);
  const createdOccurrences: HebrewEventOccurrence[] = [];
  
  const total = occurrencesToCreate.length;
  
  // Format reminders for Google Calendar API
  const apiReminders = {
    useDefault: false,
    overrides: reminders.map(minutes => ({
      method: 'popup',
      minutes,
    })),
  };
  
  // Run requests with controlled concurrency or sequentially to prevent Rate Limiting
  // Sequential is safest for rate limits and lets us report extremely accurate progress
  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i, total);
    }
    
    const occurrenceData = occurrencesToCreate[i];
    const dateStr = toLocalISOString(occurrenceData.date);
    
    // Add 1 day to Gregorian end date since Google Calendar all-day event ends are exclusive
    const endDate = new Date(occurrenceData.date);
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = toLocalISOString(endDate);
    
    // Custom description mentioning the age/anniversary number
    let description = `אירוע בלוח השנה העברי: ${occurrenceData.formattedHebrewDate}.`;
    if (startNumber !== undefined) {
      description += ` מופע מספר ${occurrenceData.occurrenceNumber}.`;
    }
    description += `\nנוצר באמצעות אפליקציית Hebrew Date Manager.`;

    const eventSummary = startNumber !== undefined
      ? `${name} (${occurrenceData.occurrenceNumber})`
      : name;

    const body = {
      summary: eventSummary,
      description,
      start: { date: dateStr },
      end: { date: endDateStr },
      transparency: 'transparent',
      reminders: apiReminders,
      extendedProperties: {
        private: {
          app_stamp: 'hebrew_calendar_app',
          group_id: groupId,
          hebrew_month: monthEn,
          hebrew_day: day.toString(),
          hebrew_year: occurrenceData.hebrewYear.toString(),
          start_number: startNumber?.toString() || '',
          original_start_year: startYearHeb.toString(),
        },
      },
    };
    
    const response = await fetchWithRetry('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `שגיאה ביצירת מופע לשנת ${occurrenceData.hebrewYear}`);
    }
    
    const createdEvent = await response.json();
    createdOccurrences.push({
      id: createdEvent.id,
      gregorianDateStr: dateStr,
      hebrewYear: occurrenceData.hebrewYear,
      occurrenceNumber: occurrenceData.occurrenceNumber,
      formattedHebrewDate: occurrenceData.formattedHebrewDate,
    });
    
    // Optional tiny delay to respect rate limit
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  if (onProgress) {
    onProgress(total, total);
  }
  
  return {
    groupId,
    name,
    hebrewDay: day,
    hebrewMonth: monthEn,
    startNumber,
    originalStartYear: startYearHeb,
    reminders,
    occurrences: createdOccurrences,
  };
}

/**
 * Delete a specific list of event IDs
 */
export async function deleteEvents(eventIds: string[], onProgress?: (current: number, total: number) => void): Promise<void> {
  const total = eventIds.length;
  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i, total);
    }
    const id = eventIds[i];
    const response = await fetchWithRetry(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
      method: 'DELETE',
    });
    
    // 404 is acceptable since the event might have been deleted manually by the user
    if (!response.ok && response.status !== 404) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `שגיאה במחיקת אירוע ${id}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (onProgress) {
    onProgress(total, total);
  }
}

/**
 * Patch existing events (update name and/or reminders without changing dates)
 */
export async function patchEventGroupMetadata(
  eventIds: string[],
  name: string,
  reminders: number[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const total = eventIds.length;
  const apiReminders = {
    useDefault: false,
    overrides: reminders.map(minutes => ({
      method: 'popup',
      minutes,
    })),
  };
  
  for (let i = 0; i < total; i++) {
    if (onProgress) {
      onProgress(i, total);
    }
    const id = eventIds[i];
    const body = {
      summary: name,
      transparency: 'transparent',
      reminders: apiReminders,
    };
    
    const response = await fetchWithRetry(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    
    if (!response.ok && response.status !== 404) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `שגיאה בעדכון פרטי אירוע ${id}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (onProgress) {
    onProgress(total, total);
  }
}
