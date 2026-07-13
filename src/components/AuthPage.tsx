import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, AlertTitle, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { getStoredClientId, setAccessToken } from '../utils/googleCalendar';

interface AuthPageProps {
  onLoginSuccess: () => void;
  onOpenSettings: () => void;
  clientIdUpdated: string;
  showSettingsButton: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onOpenSettings,
  clientIdUpdated,
  showSettingsButton,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clientId = clientIdUpdated || getStoredClientId();

  const handleGoogleLogin = () => {
    setError(null);
    setLoading(true);

    try {
      const googleObj = (window as any).google;
      if (!googleObj || !googleObj.accounts || !googleObj.accounts.oauth2) {
        throw new Error('ספריית ההתחברות של גוגל לא נטענה עדיין. אנא רענן את הדף ונסה שוב.');
      }

      if (!clientId) {
        throw new Error('יש להגדיר Google Client ID בהגדרות כדי להתחבר.');
      }

      const client = googleObj.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/calendar.events',
        callback: (tokenResponse: any) => {
          setLoading(false);
          if (tokenResponse.error) {
            setError(`שגיאה מגוגל: ${tokenResponse.error_description || tokenResponse.error}`);
            return;
          }
          if (tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token, tokenResponse.expires_in || 3600);
            onLoginSuccess();
          }
        },
        error_callback: (err: any) => {
          setLoading(false);
          setError(`שגיאת התחברות: ${err.message || 'לא ניתן להתחבר לשרת הגדרות גוגל'}`);
        }
      });

      // Request token with prompt to allow account selection
      client.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'אירעה שגיאה לא צפויה בתהליך ההתחברות.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: '100%',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        {/* Banner with gradient */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)',
            py: 4,
            textAlign: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CloudSyncIcon sx={{ fontSize: 60, mb: 1, filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>סנכרון לוח שנה עברי</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>סנכרון אוטומטי של אירועים עבריים ל-Google Calendar</Typography>
        </Box>

        <CardContent sx={{ px: 3, py: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              <AlertTitle>שגיאת התחברות</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Intro points */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <CheckCircleOutlinedIcon color="primary" sx={{ mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>אירועים חוזרים מבוססי תאריך עברי</Typography>
                <Typography variant="body2" color="text.secondary">
                  נהלו ימי הולדת, אזכרות ואירועים משפחתיים לפי התאריכים העבריים הנכונים.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <CheckCircleOutlinedIcon color="primary" sx={{ mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>סנכרון ישיר ליומן גוגל</Typography>
                <Typography variant="body2" color="text.secondary">
                  המערכת מחשבת את התאריך הלועזי המקביל לכל שנה ומייצרת אירועים ביומן גוגל שלך.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <CheckCircleOutlinedIcon color="primary" sx={{ mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>תמיכה במקרי קצה הלכתיים</Typography>
                <Typography variant="body2" color="text.secondary">
                  דיוק בשנים מעוברות (אדר א׳/ב׳), התאמה לחודשים חסרים (ל׳ בחשוון/כסלו) והזנה לאחר השקיעה.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Auth Actions */}
          {!clientId ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, textAlign: 'right' }}>
                <AlertTitle>נדרשת הגדרה ראשונית</AlertTitle>
                כדי שנוכל להתחבר לחשבון גוגל שלך, עליך להגדיר תחילה מזהה לקוח (Client ID).
              </Alert>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<SettingsIcon />}
                onClick={onOpenSettings}
                sx={{ borderRadius: '12px', py: 1.5, fontWeight: 'bold' }}
              >
                להגדרת Google Client ID
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleGoogleLogin}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4285F4 0%, #357AE8 100%)',
                  boxShadow: '0 4px 14px rgba(66, 133, 244, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #357AE8 0%, #2A69D4 100%)',
                  }
                }}
              >
                {loading ? 'מתחבר ליומן גוגל...' : 'התחברות באמצעות Google'}
              </Button>

              {showSettingsButton && (
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={onOpenSettings}
                  startIcon={<SettingsIcon />}
                  sx={{ alignSelf: 'center', textTransform: 'none', mt: 1 }}
                >
                  עדכון הגדרות חיבור / Client ID
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
