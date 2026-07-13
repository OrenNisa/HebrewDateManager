import React from 'react';
import { Container, Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)',
                color: 'white',
              }}
            >
              <ShieldOutlinedIcon fontSize="medium" />
            </Box>
            <Box sx={{ textAlign: 'start' }} dir="rtl">
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                מדיניות פרטיות / Privacy Policy
              </Typography>
              <Typography variant="caption" color="text.secondary">
                עודכן לאחרונה / Last updated: July 2026
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Hebrew Version (RTL - Right Aligned) */}
          <Box 
            dir="rtl" 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3, 
              textAlign: 'start', // Respects RTL direction, aligning text to the right
              width: '100%'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              מדיניות פרטיות (עברית)
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                1. כללי
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                אפליקציית <strong>Hebrew Date Manager</strong> ("האפליקציה") נועדה לסייע למשתמשים לסנכרן אירועים עבריים חוזרים (כגון ימי הולדת, אזכרות ואירועים משפחתיים) ישירות ליומן גוגל שלהם. אנו מכבדים את הפרטיות שלך ומחויבים להגן עליה.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                2. אבטחה ושמירת מידע
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                האפליקציה פועלת כיישום צד-לקוח בלבד (Client-side application). 
                <strong> אין לנו שרת חיצוני, ואיננו אוספים, שומרים, מעבדים או מעבירים מידע אישי כלשהו של המשתמשים שלנו לשום גורם חיצוני.</strong> כל חישובי לוח השנה והתאריכים מבוצעים באופן מקומי בדפדפן של המשתמש.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. התחברות לגוגל (Google Calendar API)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                האפליקציה משתמשת בחיבור ישיר ומאובטח מול השרתים של גוגל באמצעות פרוטוקול OAuth 2.0 המנוהל על ידי גוגל:
                <br />
                • <strong>הרשאות גישה:</strong> הרשאת הגישה ליומן (<code>calendar.events</code>) משמשת אך ורק לצורך כתיבה, קריאה, עריכה ומחיקה של מופעי האירועים העבריים שהמשתמש בוחר ליצור ולנהל דרך האפליקציה.
                <br />
                • <strong>אחסון מפתחות גישה:</strong> מפתח הגישה ליומן (Access Token) נשמר באופן זמני בלבד בזיכרון המקומי הזמני של הדפדפן (<code>sessionStorage</code>) ונמחק לצמיתות מיד עם סגירת הדפדפן/כרטיסייה או עם ביצוע התנתקות (Logout) יזומה מהאפליקציה.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. אחסון מקומי (Local Storage)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                האפליקציה עושה שימוש ב-<code>localStorage</code> של הדפדפן שלך אך ורק לצורך שמירת העדפות תצוגה טכניות (כמו שמירת העדפת מצב כהה/בהיר) או שמירת מזהה לקוח (Client ID) לצורך פיתוח ובדיקות במידה והוגדר ידנית על ידך. מידע זה אינו מועבר לאף שרת חיצוני ונשאר מקומית על מכשירך בלבד.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. יצירת קשר
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                אם יש לך שאלות או תהיות לגבי מדיניות פרטיות זו או לגבי אופן פעולת האפליקציה, ניתן ליצור קשר עם המפתח בדוא"ל: <strong>Orennisa@gmail.com</strong>.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 5 }} />

          {/* English Version (LTR - Left Aligned) */}
          <Box 
            dir="ltr" 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3, 
              textAlign: 'start', // Respects LTR direction, aligning text to the left
              width: '100%'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              Privacy Policy (English)
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                1. General
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The <strong>Hebrew Date Manager</strong> web application ("the Application") is designed to help users synchronize recurring Hebrew calendar events (such as birthdays, yahrzeits, and family events) directly to their Google Calendar. We respect your privacy and are committed to protecting it.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                2. Security & Data Storage
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The Application runs entirely as a client-side application in the user's browser. 
                <strong> We do not own a database or any external server, and we do not collect, store, process, or transfer any of your personal data to any third party.</strong> All calendar calculations and conversions are processed locally on your device.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. Google Calendar Integration (Google Calendar API)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The Application establishes a direct, secure connection to Google servers using the official Google OAuth 2.0 protocol:
                <br />
                • <strong>Access Scopes:</strong> The calendar access scope (<code>calendar.events</code>) is used solely to read, create, edit, and delete the specific Hebrew calendar events that you choose to manage through the Application.
                <br />
                • <strong>Access Token Storage:</strong> Your Google API access credentials (access tokens) are only stored temporarily in your browser's session storage (<code>sessionStorage</code>) and are permanently cleared when you close the browser tab/window or click "Logout" in the Application.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. Local Storage
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The Application utilizes the browser's <code>localStorage</code> solely to store technical and interface preferences (such as your light/dark mode preference or custom Google Client ID if manually configured). This data is stored locally on your device and is never sent to any external server.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. Contact Us
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                If you have any questions or concerns regarding this Privacy Policy or the operations of the Application, please contact the developer via email: <strong>Orennisa@gmail.com</strong>.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Action button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={onBack}
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: '8px', fontWeight: 'bold' }}
            >
              חזרה למסך הבית / Back to Home
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Container>
  );
};
