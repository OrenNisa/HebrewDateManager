import React from 'react';
import { Container, Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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
              <DescriptionOutlinedIcon fontSize="medium" />
            </Box>
            <Box sx={{ textAlign: 'start' }} dir="rtl">
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                תנאי שימוש / Terms of Service
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
              תנאי שימוש (עברית)
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                1. קבלת התנאים
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                השימוש באפליקציית <strong>Hebrew Date Manager</strong> ("האפליקציה") כפוף להסכמתך לתנאים המפורטים להלן. עצם השימוש באפליקציה מהווה הסכמה מלאה ובלתי מסויגת לתנאי שימוש אלו.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                2. תיאור השירות והגבלת אחריות
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                האפליקציה מספקת כלי חינמי לחישוב תאריכים עבריים וסנכרונם ליומן גוגל האישי שלך. השירות מסופק "כמות שהוא" (As-Is) וללא כל התחייבות או אחריות לרמת דיוק, פעילות רציפה או התאמה לצרכים ספציפיים. 
                <br />
                המפתח לא יישא בכל אחריות לנזק ישיר, עקיף או תוצאתי (לרבות אובדן נתונים, כפילויות אירועים או שיבוש ביומן גוגל) שנגרם כתוצאה מהשימוש באפליקציה. <strong>באחריות המשתמש הבלעדית לגבות את היומן שלו באופן שוטף.</strong>
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. חיבור לחשבון גוגל
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                החיבור ליומן גוגל נעשה באופן ישיר ומאובטח באמצעות פרוטוקול OAuth2 של חברת גוגל. האפליקציה אינה שומרת או אוספת את פרטי הגישה האישיים שלך בשרתים חיצוניים. כל המידע והמפתחות נשמרים זמנית בדפדפן שלך בלבד לצורך ביצוע הפעולות הנדרשות.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. שינויים בשירות ובתנאים
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                המפתח שומר לעצמו את הזכות לבצע שינויים באפליקציה, להפסיק את פעילותה או לעדכן תנאי שימוש אלו בכל עת וללא הודעה מוקדמת. מומלץ לבדוק דף זה מעת לעת על מנת להתעדכן בשינויים.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. הדין החל
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                על תנאים אלו יחולו חוקי מדינת ישראל, וכל מחלוקת משפטית הנוגעת לשימוש באפליקציה תתברר בבתי המשפט המוסמכים במחוז תל אביב-יפו.
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
              Terms of Service (English)
            </Typography>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                By using the <strong>Hebrew Date Manager</strong> web application ("the Application"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Application.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                2. Service Description & Disclaimer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The Application provides a free tool for calculating Hebrew dates and synchronizing them with your personal Google Calendar. This service is provided "As-Is" and "As-Available" without warranties of any kind.
                <br />
                The developer shall not be held liable for any direct, indirect, or consequential damages (including data loss, event duplication, or calendar disruption) arising from your use of the Application. <strong>You are solely responsible for backing up your Google Calendar data.</strong>
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                3. Google Account Connection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Google Calendar connection is handled securely via standard Google OAuth2 protocol. We do not store, collect, or transmit your credentials to any external servers. Access credentials reside temporarily within your browser's local memory only.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                4. Modifications to Service and Terms
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                The developer reserves the right to modify or discontinue the Application, or update these Terms of Service at any time without notice. Continued use of the Application constitutes acceptance of the updated terms.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                5. Governing Law
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                These terms are governed by the laws of the State of Israel. Any legal disputes arising from using the Application shall be settled in the competent courts of the Tel Aviv-Yafo district.
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
