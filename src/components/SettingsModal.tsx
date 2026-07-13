import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getStoredClientId, setStoredClientId } from '../utils/googleCalendar';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newClientId: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSave }) => {
  const [clientId, setClientId] = useState(getStoredClientId());

  const handleSave = () => {
    setStoredClientId(clientId.trim());
    onSave(clientId.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>הגדרות חיבור ל-Google Calendar</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom sx={{ fontWeight: '500' }}>
          על מנת לסנכרן אירועים ישירות ליומן גוגל שלך, נדרש מזהה לקוח (Client ID) של Google Cloud.
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <TextField
            fullWidth
            label="Google Client ID"
            placeholder="123456789-abc.apps.googleusercontent.com"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            variant="outlined"
            dir="ltr"
          />
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            כיצד משיגים Google Client ID?
          </Typography>
          <Typography variant="body2" component="div" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div>
              1. היכנסו ל-
              <Link href="https://console.cloud.google.com/" target="_blank" rel="noopener">
                Google Cloud Console
              </Link> 
              וצרו פרויקט חדש.
            </div>
            <div>
              2. בתפריט הצד, חפשו ורשמו לפרויקט את ה-<strong>Google Calendar API</strong> (לחצו Enable).
            </div>
            <div>
              3. עברו ל-<strong>APIs & Services &gt; OAuth consent screen</strong>, בחרו ב-External, והשלימו את הפרטים הבסיסיים (שם האפליקציה ודוא"ל).
            </div>
            <div>
              4. בשלב ה-Scopes, הוסיפו את ההרשאה הבאה: 
              <Box component="code" sx={{ display: 'block', p: 0.5, bgcolor: 'background.paper', borderRadius: 1, my: 0.5, fontSize: '0.8rem', wordBreak: 'break-all' }}>
                https://www.googleapis.com/auth/calendar.events
              </Box>
            </div>
            <div>
              5. עברו ל-<strong>Credentials</strong>, לחצו על <strong>Create Credentials &gt; OAuth client ID</strong>.
            </div>
            <div>
              6. בחרו במיזם <strong>Web application</strong>. תחת <strong>Authorized JavaScript origins</strong> הוסיפו את כתובת האתר שבו פועלת האפליקציה (בפיתוח מקומי: <code>http://localhost:5173</code>).
            </div>
            <div>
              7. לחצו על Create, העתיקו את ה-Client ID שנוצר והדביקו אותו כאן למעלה.
            </div>
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">ביטול</Button>
        <Button onClick={handleSave} variant="contained" color="primary">שמירה</Button>
      </DialogActions>
    </Dialog>
  );
};
