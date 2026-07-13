import React from 'react';
import { Box, Typography, Link, Container } from '@mui/material';

export const Footer: React.FC = () => {
  const handleNav = (route: string) => {
    window.location.hash = `#/${route}`;
    // Dispatch popstate event to trigger navigation handler in App.tsx
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4, 
        mt: 'auto', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: '500' }}>
          © {new Date().getFullYear()} Hebrew Date Manager. כל הזכויות שמורות.
        </Typography>
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleNav('privacy')}
            sx={{ 
              color: 'text.secondary', 
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' }
            }}
          >
            מדיניות פרטיות / Privacy Policy
          </Link>
          <Typography variant="body2" color="text.disabled" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            |
          </Typography>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleNav('terms')}
            sx={{ 
              color: 'text.secondary', 
              textDecoration: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              '&:hover': { color: 'primary.main', textDecoration: 'underline' }
            }}
          >
            תנאי שימוש / Terms of Service
          </Link>
        </Box>
      </Container>
    </Box>
  );
};
