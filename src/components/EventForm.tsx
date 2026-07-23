import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Grid,
  Divider,
  FormGroup,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import SaveIcon from '@mui/icons-material/Save';
import { HEBREW_MONTHS, GEMATRIA_DAYS, gregorianToHebrew } from '../utils/hebcal';
import type { HebrewEventGroup } from '../utils/googleCalendar';

export interface EventFormValues {
  name: string;
  isHebrewInput: boolean;
  hebrewDay: number;
  hebrewMonth: string; // English key e.g. 'Tishrei'
  gregorianDate: string; // YYYY-MM-DD
  afterSunset: boolean;
  startNumber?: number;
  occurrenceCount: number;
  reminders: number[]; // minutes before
}

interface EventFormProps {
  initialValues?: HebrewEventGroup;
  onSubmit: (values: EventFormValues) => Promise<void>;
  loading: boolean;
  buttonLabel?: string;
  onCancel?: () => void;
}

const REMINDER_OPTIONS = [
  { label: 'יום 1 לפני', value: 1440 },
  { label: '3 ימים לפני', value: 4320 },
  { label: 'שבוע לפני', value: 10080 },
  { label: 'שבועיים לפני', value: 20160 },
  { label: 'חודש לפני', value: 43200 },
];

export const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  loading,
  buttonLabel = 'יצירת אירוע ביומן',
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [inputType, setInputType] = useState<'hebrew' | 'gregorian'>('hebrew');
  
  // Hebrew date states
  const [hebrewDay, setHebrewDay] = useState(1);
  const [hebrewMonth, setHebrewMonth] = useState('Tishrei');
  
  // Gregorian date states
  const [gregorianDate, setGregorianDate] = useState(new Date().toISOString().split('T')[0]);
  const [afterSunset, setAfterSunset] = useState(false);
  
  // Additional fields
  const [startNumber, setStartNumber] = useState<string>('');
  const [occurrenceCount, setOccurrenceCount] = useState<number>(30);
  const [isCountOverridden, setIsCountOverridden] = useState(false);
  
  // Reminders (array of minutes before)
  const [reminders, setReminders] = useState<number[]>([]);
  const [noReminders, setNoReminders] = useState(true);

  // Initialize values when initialValues are provided (Edit mode)
  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setInputType('hebrew'); // Default to Hebrew view when editing
      setHebrewDay(initialValues.hebrewDay);
      setHebrewMonth(initialValues.hebrewMonth);
      setStartNumber(initialValues.startNumber?.toString() || '');
      setReminders(initialValues.reminders || []);
      setNoReminders(!initialValues.reminders || initialValues.reminders.length === 0);
      
      // Count of occurrences is based on total occurrences in the group
      setOccurrenceCount(initialValues.occurrences.length);
      setIsCountOverridden(true);
    }
  }, [initialValues]);

  // Handle calculation of occurrence default count based on start number (age)
  useEffect(() => {
    if (isCountOverridden) return;

    if (startNumber && !isNaN(parseInt(startNumber, 10))) {
      const startNum = parseInt(startNumber, 10);
      if (startNum >= 0 && startNum < 120) {
        setOccurrenceCount(120 - startNum);
      } else {
        setOccurrenceCount(30);
      }
    } else {
      setOccurrenceCount(30);
    }
  }, [startNumber, isCountOverridden]);

  // Handle Input Type Change
  const handleInputTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newType: 'hebrew' | 'gregorian' | null
  ) => {
    if (newType !== null) {
      setInputType(newType);
    }
  };

  // Handle Reminders Checkbox change
  const handleReminderToggle = (minutes: number) => {
    setNoReminders(false);
    if (reminders.includes(minutes)) {
      const updated = reminders.filter(m => m !== minutes);
      setReminders(updated);
      if (updated.length === 0) setNoReminders(true);
    } else {
      setReminders([...reminders, minutes]);
    }
  };

  const handleNoReminderToggle = () => {
    setNoReminders(true);
    setReminders([]);
  };

  // Convert Gregorian to Hebrew (informational notice below Gregorian input)
  const getGregorianConvertedHebrew = () => {
    if (!gregorianDate) return '';
    try {
      const dateParts = gregorianDate.split('-').map(Number);
      const jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const converted = gregorianToHebrew(jsDate, afterSunset);
      return converted.formatted;
    } catch {
      return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Build the final values
    let finalDay = hebrewDay;
    let finalMonth = hebrewMonth;

    if (inputType === 'gregorian') {
      // Convert the selected Gregorian date to Hebrew
      const dateParts = gregorianDate.split('-').map(Number);
      const jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      const converted = gregorianToHebrew(jsDate, afterSunset);
      finalDay = converted.day;
      finalMonth = converted.monthEn;
    }

    const formValues: EventFormValues = {
      name: name.trim(),
      isHebrewInput: inputType === 'hebrew',
      hebrewDay: finalDay,
      hebrewMonth: finalMonth,
      gregorianDate,
      afterSunset,
      startNumber: startNumber !== '' ? parseInt(startNumber, 10) : undefined,
      occurrenceCount,
      reminders,
    };

    onSubmit(formValues);
  };

  return (
    <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <CalendarMonthIcon color="primary" />
          {initialValues ? 'עריכת אירוע' : 'הוספת אירוע חדש'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          הגדירו את פרטי האירוע. המערכת תחשב את המופעים הלועזיים שלו לאורך השנים ותסנכרן אותם ליומן.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Event Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="שם האירוע (חובה)"
                placeholder="לדוגמה: יום הולדת לאמא, אזכרה לסבא"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
              />
            </Grid>

            {/* Input Type Selector Toggle */}
            {!initialValues && (
              <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                  value={inputType}
                  exclusive
                  onChange={handleInputTypeChange}
                  color="primary"
                  size="medium"
                  fullWidth
                  sx={{ maxWidth: 400 }}
                >
                  <ToggleButton value="hebrew" sx={{ fontWeight: 'bold', gap: 0.5 }}>
                    <CalendarMonthIcon fontSize="small" />
                    הזנת תאריך עברי
                  </ToggleButton>
                  <ToggleButton value="gregorian" sx={{ fontWeight: 'bold', gap: 0.5 }}>
                    <EventIcon fontSize="small" />
                    הזנת תאריך לועזי
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            )}

            {/* Date Inputs depending on Selection */}
            <Grid size={{ xs: 12 }}>
              {inputType === 'hebrew' ? (
                <Grid container spacing={2}>
                  {/* Hebrew Day Dropdown */}
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="יום עברי"
                      value={hebrewDay}
                      onChange={(e) => setHebrewDay(Number(e.target.value))}
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                        <MenuItem key={day} value={day}>
                          {GEMATRIA_DAYS[day]} ({day})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Hebrew Month Dropdown */}
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="חודש עברי"
                      value={hebrewMonth}
                      onChange={(e) => setHebrewMonth(e.target.value)}
                    >
                      {HEBREW_MONTHS.map((m) => (
                        <MenuItem key={m.nameEn} value={m.nameEn}>
                          {m.nameHe}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              ) : (
                <Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="תאריך לועזי מקור"
                        value={gregorianDate}
                        onChange={(e) => setGregorianDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={afterSunset}
                            onChange={(e) => setAfterSunset(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="התרחש לאחר השקיעה (היום העברי הבא)"
                      />
                    </Grid>
                  </Grid>
                  {/* Live Conversion Preview */}
                  {gregorianDate && (
                    <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}>
                      התאריך העברי המחושב: {getGregorianConvertedHebrew()}
                    </Typography>
                  )}
                </Box>
              )}
            </Grid>

            {/* Optional Age/Starting number */}
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="מספור התחלתי (אופציונלי)"
                placeholder="למשל: גיל כיום, שנת אזכרה"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>

            {/* Total Occurrences to generate */}
            <Grid size={{ xs: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="כמות מופעים עתידיים"
                  value={occurrenceCount}
                  onChange={(e) => {
                    setOccurrenceCount(Math.max(1, Number(e.target.value)));
                    setIsCountOverridden(true);
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            {/* Reminders section */}
            <Grid size={{ xs: 12 }}>
              <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>תזכורות (יופיעו בהתראות גוגל):</FormLabel>
              <FormGroup row sx={{ gap: { xs: 1, sm: 2 } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noReminders}
                      onChange={handleNoReminderToggle}
                      color="primary"
                    />
                  }
                  label="ללא תזכורת"
                />
                
                {REMINDER_OPTIONS.map((opt) => (
                  <FormControlLabel
                    key={opt.value}
                    control={
                      <Checkbox
                        checked={reminders.includes(opt.value)}
                        onChange={() => handleReminderToggle(opt.value)}
                        color="primary"
                      />
                    }
                    label={opt.label}
                  />
                ))}
              </FormGroup>
            </Grid>

            {/* Action Buttons */}
            <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
              {onCancel && (
                <Button variant="outlined" color="inherit" onClick={onCancel} disabled={loading}>
                  ביטול
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !name.trim()}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  px: 3,
                }}
              >
                {loading ? 'מייצר אירועים ביומן...' : buttonLabel}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
