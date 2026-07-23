import React from 'react';
import { Container, Box, Card, CardContent, Typography, Button, Divider, Link } from '@mui/material';
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
              textAlign: 'start',
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
                2. נגישות למידע של משתמשי גוגל (Google User Data Access)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                האפליקציה מבקשת גישה להרשאת <code>https://www.googleapis.com/auth/calendar.events</code> לצורך ביצוע הפעולות הבאות בלבד:
                <br />
                • קריאה, יצירה, עריכה ומחיקה של אירועים ביומן גוגל של המשתמש שנוצרו על ידי האפליקציה (ומסומנים בתגית זיהוי פנימית).
                <br />
                • האפליקציה אינה קוראת, אינה מעבדת ואינה שומרת אירועים אישיים אחרים ביומן גוגל של המשתמש.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. מנגנוני הגנה ואבטחת מידע (Data Protection & Security)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>ארכיטקטורת צד-לקוח בלבד:</strong> האפליקציה פועלת בדפדפן המשתמש בלבד (Client-side). אין לנו שרת אחסון חיצוני, מסד נתונים או צד-שרת.
                <br />
                • <strong>אבטחת תקשורת:</strong> כל התקשורת מול שרתי גוגל מבוצעת בפרוטוקול מוצפן HTTPS דרך OAuth 2.0 הרשמי של גוגל.
                <br />
                • <strong>אי-שיתוף נתונים:</strong> איננו אוספים, איננו מוכרים ואיננו משתפים מידע של משתמשי גוגל עם שום גורם שלישי, מפרסמים או מודלי בינה מלאכותית (AI).
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. שמירת מידע ומחיקתו (Data Retention & Deletion)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>אסימוני גישה (Tokens):</strong> מפתחות הגישה של Google OAuth נשמרים אך ורק בזיכרון הזמני בדפדפן (<code>sessionStorage</code>) ונמחקים לצמיתות מיד עם סגירת הכרטיסייה/הדפדפן או בעת התנתקות יזומה.
                <br />
                • <strong>אירועי יומן:</strong> האירועים שנכתבו ליומן גוגל נשארים בחשבון גוגל של המשתמש עד שהמשתמש בוחר למחוק אותם דרך האפליקציה או ישירות ביומן גוגל.
                <br />
                • <strong>ביטול גישה:</strong> המשתמש יכול לבטל את גישת האפליקציה בכל עת דרך <Link href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">הגדרות האבטחה של חשבון גוגל</Link>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. עמידה במדיניות השימוש המוגבל של גוגל (Limited Use Disclosure)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                השימוש והעברה של מידע שהתקבל מ-Google APIs לכל אפליקציה אחרת יצייתו ל-<Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</Link>, כולל דרישות ה-Limited Use.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                6. יצירת קשר
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                לכל שאלה או תהייה בנושא פרטיות ואבטחת מידע, ניתן ליצור קשר עם המפתח בדוא"ל: <strong>Orennisa@gmail.com</strong>.
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
              textAlign: 'start',
              width: '100%'
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
              Privacy Policy (English)
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                1. General Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The <strong>Hebrew Date Manager</strong> web application ("the Application") helps users synchronize recurring Hebrew calendar events (such as birthdays, yahrzeits, and anniversaries) directly to their Google Calendar. We respect your privacy and are fully committed to protecting your data.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                2. Google User Data Access & Scopes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The Application requests access to the <code>https://www.googleapis.com/auth/calendar.events</code> scope for the following explicit purposes:
                <br />
                • To read, create, update, and delete specific Hebrew calendar events generated by the Application on the user's primary Google Calendar (tagged with a custom metadata identifier).
                <br />
                • The Application does not access, read, process, or modify any unrelated personal calendar events.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. Data Protection & Security Disclosures
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Client-Side Architecture:</strong> The Application operates entirely client-side in the user's web browser. We do not own or operate any external backend server, database, or cloud storage.
                <br />
                • <strong>Transit Encryption:</strong> All API communication with Google services is conducted over secure, encrypted HTTPS connections via Google's official OAuth 2.0 framework.
                <br />
                • <strong>No Data Sharing, Selling, or AI Training:</strong> We do not collect, store, share, transfer, or sell Google user data to any third parties, advertisers, data brokers, or AI/ML model trainers.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. Data Retention and Deletion Disclosures
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • <strong>Token Retention & Deletion:</strong> Google OAuth access tokens are stored strictly in temporary browser memory (<code>sessionStorage</code>). Tokens are automatically deleted when the user closes the browser tab/window or clicks "Logout" within the Application.
                <br />
                • <strong>Calendar Event Retention & Deletion:</strong> Events created in Google Calendar remain in the user's Google Calendar until deleted by the user directly in Google Calendar or deleted using the Application's delete function. No event data is retained on any external server.
                <br />
                • <strong>Revoking Access:</strong> Users can revoke the Application's access at any time via <Link href="https://myaccount.google.com/permissions" target="_blank" rel="noopener">Google Account Security Permissions</Link>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. Google API Services User Data Policy Compliance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Hebrew Date Manager's use and transfer of information received from Google APIs to any other app will adhere to the <Link href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</Link>, including the Limited Use requirements.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                6. Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                If you have any questions or concerns regarding this Privacy Policy or data security, please contact the developer via email: <strong>Orennisa@gmail.com</strong>.
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
