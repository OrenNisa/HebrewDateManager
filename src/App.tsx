import { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import { Header } from './components/Header';
import { AuthPage } from './components/AuthPage';
import { EventForm } from './components/EventForm';
import type { EventFormValues } from './components/EventForm';
import { EventList } from './components/EventList';
import { SettingsModal } from './components/SettingsModal';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { Footer } from './components/Footer';

import {
  fetchHebrewEventGroups,
  createHebrewEventGroup,
  deleteEvents,
  isLoggedIn,
  logout,
  getStoredClientId,
} from './utils/googleCalendar';
import type { HebrewEventGroup, CorruptEvent } from './utils/googleCalendar';
import { getHebrewCurrentYear, getUpcomingHebrewYear } from './utils/hebcal';

// Create RTL Emotion Cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create MUI Custom Theme (supporting RTL and Dark/Light Modes)
const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: {
        main: '#3f51b5',
        light: '#7986cb',
        dark: '#303f9f',
        contrastText: '#fff',
      },
      secondary: {
        main: '#009688',
        light: '#33ab9f',
        dark: '#00665c',
        contrastText: '#fff',
      },
      background: {
        default: mode === 'light' ? '#f5f7fa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      success: {
        main: '#2e7d32',
      },
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
          },
        },
      },
    },
  });

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('hebrew_calendar_dark_mode');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [authStatus, setAuthStatus] = useState<boolean>(isLoggedIn());
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [clientIdUpdated, setClientIdUpdated] = useState<string>(getStoredClientId());
  
  // Dashboard states
  const [loading, setLoading] = useState<boolean>(false);
  const [eventGroups, setEventGroups] = useState<HebrewEventGroup[]>([]);
  const [corruptEvents, setCorruptEvents] = useState<CorruptEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Simple client-side routing state for privacy/terms pages
  const [currentRoute, setCurrentRoute] = useState<'home' | 'privacy' | 'terms'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    if (path === '/privacy' || hash === '#/privacy' || search.includes('page=privacy')) {
      return 'privacy';
    }
    if (path === '/terms' || hash === '#/terms' || search.includes('page=terms')) {
      return 'terms';
    }
    return 'home';
  });

  // Listen to navigation popstate and hashchange events
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path === '/privacy' || hash === '#/privacy' || search.includes('page=privacy')) {
        setCurrentRoute('privacy');
      } else if (path === '/terms' || hash === '#/terms' || search.includes('page=terms')) {
        setCurrentRoute('terms');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);
  
  // Progress states for creating/editing/deleting (which take multiple API requests)
  const [actionLoadingGroupId, setActionLoadingGroupId] = useState<string | null>(null);
  const [actionProgress, setActionProgress] = useState<{ current: number; total: number } | null>(null);

  // Sync / Refresh helper
  const refreshEventList = useCallback(async () => {
    if (!isLoggedIn()) return;
    setLoading(true);
    setError(null);
    try {
      const { groups, corruptEvents } = await fetchHebrewEventGroups();
      setEventGroups(groups);
      setCorruptEvents(corruptEvents);
    } catch (err: any) {
      setError(err.message || 'שגיאה בסנכרון הנתונים מיומן גוגל.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen to session expiry or logout triggers
  useEffect(() => {
    const handleAuthChange = () => {
      const logged = isLoggedIn();
      setAuthStatus(logged);
      if (logged) {
        refreshEventList();
      } else {
        setEventGroups([]);
        setCorruptEvents([]);
      }
    };

    window.addEventListener('auth_change', handleAuthChange);
    if (authStatus) {
      refreshEventList();
    }
    
    return () => window.removeEventListener('auth_change', handleAuthChange);
  }, [authStatus, refreshEventList]);

  // Handle dark mode toggle
  const handleToggleTheme = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('hebrew_calendar_dark_mode', newVal.toString());
      return newVal;
    });
  };

  // Google OAuth flow handlers
  const handleLoginSuccess = () => {
    setAuthStatus(true);
    setSuccessMessage('החיבור ליומן גוגל בוצע בהצלחה!');
  };

  const handleLogout = () => {
    logout();
    setAuthStatus(false);
    setEventGroups([]);
    setCorruptEvents([]);
    setSuccessMessage('התנתקת בהצלחה מהמערכת.');
  };

  const handleSaveClientId = (newId: string) => {
    setClientIdUpdated(newId);
    setSuccessMessage('מזהה הלקוח (Client ID) עודכן בהצלחה.');
    
    // If we changed Client ID, we must log out to force re-auth with new credentials
    if (isLoggedIn()) {
      handleLogout();
    }
  };

  // Add Event Handler
  const handleAddEvent = async (values: EventFormValues) => {
    setActionLoadingGroupId('new_event');
    setError(null);
    try {
      const startYearHeb = getUpcomingHebrewYear(values.hebrewDay, values.hebrewMonth);
      
      await createHebrewEventGroup(
        values.name,
        values.hebrewDay,
        values.hebrewMonth,
        startYearHeb,
        values.startNumber,
        values.occurrenceCount,
        values.reminders,
        (current, total) => {
          setActionProgress({ current, total });
        }
      );
      
      setSuccessMessage('האירוע והמופעים שלו נוצרו וסונכרנו בהצלחה!');
      await refreshEventList();
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת אירוע עברי.');
    } finally {
      setActionLoadingGroupId(null);
      setActionProgress(null);
    }
  };

  // Delete Event Handler
  const handleDeleteEvent = async (groupId: string, eventIds: string[], applyToAll: boolean) => {
    setActionLoadingGroupId(groupId);
    setError(null);
    try {
      setActionProgress({ current: 0, total: eventIds.length });
      
      await deleteEvents(eventIds, (current, total) => {
        setActionProgress({ current, total });
      });
      
      setSuccessMessage(applyToAll ? 'האירוע נמחק לחלוטין בהצלחה!' : 'המופעים העתידיים נמחקו בהצלחה!');
      await refreshEventList();
    } catch (err: any) {
      setError(err.message || 'שגיאה במחיקת אירועים.');
    } finally {
      setActionLoadingGroupId(null);
      setActionProgress(null);
    }
  };

  // Edit Event Handler
  const handleEditEvent = async (
    group: HebrewEventGroup,
    updatedValues: EventFormValues,
    applyToAll: boolean
  ) => {
    setActionLoadingGroupId(group.groupId);
    setError(null);
    try {
      const currentHebYear = getHebrewCurrentYear();
      
      if (applyToAll) {
        // Delete all old events
        const eventIds = group.occurrences.map(o => o.id);
        setActionProgress({ current: 0, total: eventIds.length + updatedValues.occurrenceCount });
        
        await deleteEvents(eventIds, (curr) => {
          setActionProgress({ current: curr, total: eventIds.length + updatedValues.occurrenceCount });
        });
        
        // Recreate all from original start year
        await createHebrewEventGroup(
          updatedValues.name,
          updatedValues.hebrewDay,
          updatedValues.hebrewMonth,
          group.originalStartYear,
          updatedValues.startNumber,
          updatedValues.occurrenceCount,
          updatedValues.reminders,
          (curr) => {
            setActionProgress({ current: eventIds.length + curr, total: eventIds.length + updatedValues.occurrenceCount });
          },
          group.groupId // Reuses the same group ID
        );
      } else {
        // Apply to future only (current year onwards)
        const futureEvents = group.occurrences.filter(o => o.hebrewYear >= currentHebYear);
        const eventIdsToDelete = futureEvents.map(o => o.id);
        
        setActionProgress({ current: 0, total: eventIdsToDelete.length + updatedValues.occurrenceCount });
        
        await deleteEvents(eventIdsToDelete, (curr) => {
          setActionProgress({ current: curr, total: eventIdsToDelete.length + updatedValues.occurrenceCount });
        });
        
        // Calculate new start year and start number for the first of the future occurrences
        const futureStartYear = getUpcomingHebrewYear(updatedValues.hebrewDay, updatedValues.hebrewMonth);
        let calculatedStartNumber = updatedValues.startNumber;
        if (group.startNumber !== undefined) {
          calculatedStartNumber = group.startNumber + (futureStartYear - group.originalStartYear);
        }
        
        // Create new future occurrences starting from futureStartYear
        await createHebrewEventGroup(
          updatedValues.name,
          updatedValues.hebrewDay,
          updatedValues.hebrewMonth,
          futureStartYear,
          calculatedStartNumber,
          updatedValues.occurrenceCount,
          updatedValues.reminders,
          (curr) => {
            setActionProgress({ current: eventIdsToDelete.length + curr, total: eventIdsToDelete.length + updatedValues.occurrenceCount });
          },
          group.groupId // Reuses the same group ID
        );
      }
      
      setSuccessMessage('האירוע עודכן ביומן בהצלחה!');
      await refreshEventList();
    } catch (err: any) {
      setError(err.message || 'שגיאה בעדכון האירוע.');
    } finally {
      setActionLoadingGroupId(null);
      setActionProgress(null);
    }
  };

  // Delete Corrupt Events Handler
  const handleDeleteCorruptEvents = async (eventIds: string[]) => {
    setActionLoadingGroupId('corrupt');
    setError(null);
    try {
      setActionProgress({ current: 0, total: eventIds.length });
      await deleteEvents(eventIds, (current, total) => {
        setActionProgress({ current, total });
      });
      setSuccessMessage('כל האירועים הפגומים נמחקו בהצלחה מהיומן!');
      await refreshEventList();
    } catch (err: any) {
      setError(err.message || 'שגיאה במחיקת אירועים פגומים.');
    } finally {
      setActionLoadingGroupId(null);
      setActionProgress(null);
    }
  };


  const theme = getAppTheme(darkMode ? 'dark' : 'light');

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header
            darkMode={darkMode}
            onToggleTheme={handleToggleTheme}
            onOpenSettings={() => setSettingsOpen(true)}
            showSettingsButton={!import.meta.env.VITE_GOOGLE_CLIENT_ID}
            isLoggedIn={authStatus}
            onLogout={handleLogout}
          />

          <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {currentRoute === 'privacy' ? (
              <PrivacyPage
                onBack={() => {
                  window.history.pushState({}, '', '/');
                  window.location.hash = '';
                  setCurrentRoute('home');
                }}
              />
            ) : currentRoute === 'terms' ? (
              <TermsPage
                onBack={() => {
                  window.history.pushState({}, '', '/');
                  window.location.hash = '';
                  setCurrentRoute('home');
                }}
              />
            ) : !authStatus ? (
            <AuthPage
              onLoginSuccess={handleLoginSuccess}
              onOpenSettings={() => setSettingsOpen(true)}
              clientIdUpdated={clientIdUpdated}
              showSettingsButton={!import.meta.env.VITE_GOOGLE_CLIENT_ID}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Event Creator Form */}
              <EventForm
                onSubmit={handleAddEvent}
                loading={actionLoadingGroupId === 'new_event'}
              />

              {/* Progress blocking overlay for form submission */}
              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, flexDirection: 'column', gap: 2 }}
                open={actionLoadingGroupId === 'new_event'}
              >
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>מייצר אירועים ביומן...</Typography>
                {actionProgress && (
                  <Typography variant="body2">
                    מעבד: {actionProgress.current} מתוך {actionProgress.total}
                  </Typography>
                )}
              </Backdrop>

              {/* List of Synced Events */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <EventList
                  groups={eventGroups}
                  corruptEvents={corruptEvents}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  onDeleteCorrupt={handleDeleteCorruptEvents}
                  loadingGroupId={actionLoadingGroupId !== 'new_event' ? actionLoadingGroupId : null}
                  loadingProgress={actionProgress}
                />
              )}
            </Box>
          )}
        </Container>

        <Footer />
        </Box>

        {/* Global Success Toasts */}
        <Snackbar
          open={successMessage !== null}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Google API Client Config Modal */}
        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSaveClientId}
        />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
