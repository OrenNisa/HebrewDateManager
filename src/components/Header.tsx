import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  showSettingsButton: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleTheme,
  onOpenSettings,
  showSettingsButton,
  isLoggedIn,
  onLogout,
}) => {

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        
        {/* App Title / Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)',
              color: 'white',
              boxShadow: '0 4px 10px rgba(63, 81, 181, 0.3)',
            }}
          >
            <CalendarMonthIcon />
          </Box>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #3f51b5 0%, #009688 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            לוח שנה עברי
          </Typography>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Light/Dark Toggle */}
          <IconButton onClick={onToggleTheme} color="inherit" title={darkMode ? "מצב יום" : "מצב לילה"}>
            {darkMode ? <Brightness7Icon color="warning" /> : <Brightness4Icon color="action" />}
          </IconButton>

          {/* Settings Button */}
          {showSettingsButton && (
            <IconButton onClick={onOpenSettings} color="inherit" title="הגדרות חיבור">
              <SettingsIcon color="action" />
            </IconButton>
          )}

          {/* Logout Button */}
          {isLoggedIn && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={onLogout}
              startIcon={<LogoutIcon sx={{ transform: 'scaleX(-1)' }} />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                ml: 1,
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            >
              התנתק
            </Button>
          )}
          {isLoggedIn && (
            <IconButton
              color="error"
              onClick={onLogout}
              title="התנתק"
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
              <LogoutIcon sx={{ transform: 'scaleX(-1)' }} />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
