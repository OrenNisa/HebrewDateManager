import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Grid,
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import LinkIcon from '@mui/icons-material/Link';
import type { HebrewEventGroup, CorruptEvent } from '../utils/googleCalendar';
import { getHebrewMonthHebrewName, GEMATRIA_DAYS, getHebrewCurrentYear } from '../utils/hebcal';
import { EventForm } from './EventForm';
import type { EventFormValues } from './EventForm';

interface EventListProps {
  groups: HebrewEventGroup[];
  corruptEvents: CorruptEvent[];
  onEdit: (group: HebrewEventGroup, updatedValues: EventFormValues, applyToAll: boolean) => Promise<void>;
  onDelete: (groupId: string, eventIdsToDelete: string[], applyToAll: boolean) => Promise<void>;
  onDeleteCorrupt: (eventIds: string[]) => Promise<void>;
  loadingGroupId: string | null;
  loadingProgress: { current: number; total: number } | null;
}

export const EventList: React.FC<EventListProps> = ({
  groups,
  corruptEvents,
  onEdit,
  onDelete,
  onDeleteCorrupt,
  loadingGroupId,
  loadingProgress,
}) => {
  // States for expanding occurrences list
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  // States for Edit / Delete choice dialogs
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<HebrewEventGroup | null>(null);
  const [selectedGroupForDelete, setSelectedGroupForDelete] = useState<HebrewEventGroup | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Temp state for editing values during the confirm scope flow
  const [tempEditValues, setTempEditValues] = useState<EventFormValues | null>(null);

  const currentHebrewYear = getHebrewCurrentYear();

  const handleToggleExpand = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  // Reminders text formatting
  const getReminderLabel = (minutes: number) => {
    if (minutes === 1440) return 'יום לפני';
    if (minutes === 4320) return '3 ימים לפני';
    if (minutes === 10080) return 'שבוע לפני';
    if (minutes === 20160) return 'שבועיים לפני';
    if (minutes === 43200) return 'חודש לפני';
    return `${minutes / 60} שעות לפני`;
  };

  // Delete Action Trigger
  const handleDeleteClick = (group: HebrewEventGroup) => {
    setSelectedGroupForDelete(group);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = async (applyToAll: boolean) => {
    if (!selectedGroupForDelete) return;
    
    let eventIds: string[] = [];
    if (applyToAll) {
      // Delete all occurrences
      eventIds = selectedGroupForDelete.occurrences.map(o => o.id);
    } else {
      // Delete from current year onwards
      eventIds = selectedGroupForDelete.occurrences
        .filter(o => o.hebrewYear >= currentHebrewYear)
        .map(o => o.id);
    }

    setDeleteConfirmOpen(false);
    await onDelete(selectedGroupForDelete.groupId, eventIds, applyToAll);
    setSelectedGroupForDelete(null);
  };

  // Edit Action Trigger
  const handleEditClick = (group: HebrewEventGroup) => {
    setSelectedGroupForEdit(group);
  };

  const handleTempEditSubmit = async (applyToAll: boolean) => {
    if (selectedGroupForEdit && tempEditValues) {
      const values = tempEditValues;
      setTempEditValues(null);
      setSelectedGroupForEdit(null);
      await onEdit(selectedGroupForEdit, values, applyToAll);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 'bold' }}>
        <CalendarMonthIcon color="primary" />
        האירועים המסונכרנים שלך ({groups.length})
      </Typography>

      {/* Corrupt Events Alert Box */}
      {corruptEvents.length > 0 && (
        <Card sx={{ mt: 1, mb: 4, border: '1px solid', borderColor: 'error.light', bgcolor: 'error.shades', borderRadius: 3, boxShadow: '0 4px 12px rgba(211, 47, 47, 0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" color="error" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              ⚠️ נמצאו {corruptEvents.length} אירועים פגומים ביומן גוגל
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              אירועים אלו נוצרו בעבר על ידי האפליקציה ביומן שלך, אך מטא-הנתונים הפנימיים שלהם חסרים או פגומים (למשל, מזהה הקבוצה נמחק). כתוצאה מכך, לא ניתן לשייך אותם לקבוצת אירועים כלשהי. מומלץ למחוק אותם כדי לנקות את היומן.
            </Typography>
            
            <List dense sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 1, mb: 2, maxHeight: 150, overflowY: 'auto' }}>
              {corruptEvents.map(e => (
                <ListItem key={e.id}>
                  <ListItemText 
                    primary={e.summary} 
                    secondary={`סיבת פגם: ${e.reason}`} 
                    slotProps={{
                      primary: { variant: 'body2', sx: { fontWeight: 'bold' } },
                      secondary: { variant: 'caption' }
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  const eventIds = corruptEvents.map(e => e.id);
                  onDeleteCorrupt(eventIds);
                }}
                disabled={loadingGroupId === 'corrupt'}
                startIcon={loadingGroupId === 'corrupt' ? <CircularProgress size={20} color="inherit" /> : <DeleteOutlinedIcon />}
                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
              >
                {loadingGroupId === 'corrupt' ? 'מוחק אירועים פגומים...' : `מחיקת ${corruptEvents.length} אירועים פגומים`}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {groups.length === 0 ? (
        <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider', textAlign: 'center', py: 6, px: 2 }}>
          <Typography color="text.secondary" variant="body1">
            לא נמצאו אירועים עבריים ביומן גוגל שלך.
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            השתמשו בטופס למעלה כדי ליצור ולסנכרן את האירוע העברי הראשון שלכם!
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {groups.map((group) => {
            const isWorking = loadingGroupId === group.groupId;
            const isExpanded = expandedGroupId === group.groupId;
            
            // Format Hebrew Date string
            const dayHe = GEMATRIA_DAYS[group.hebrewDay] || group.hebrewDay;
            const monthHe = getHebrewMonthHebrewName(group.hebrewMonth);
            
            // Next occurrence calculation
            const futureOccurrences = group.occurrences.filter(o => {
              const oDate = new Date(o.gregorianDateStr);
              const today = new Date();
              today.setHours(0,0,0,0);
              return oDate >= today;
            });
            const nextOccurrence = futureOccurrences[0] || group.occurrences[group.occurrences.length - 1];

            return (
              <Grid size={{ xs: 12 }} key={group.groupId}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                    },
                  }}
                >
                  {isWorking && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(255,255,255,0.85)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3,
                      }}
                    >
                      <CircularProgress size={40} />
                      {loadingProgress && (
                        <Typography variant="body2" sx={{ mt: 1, color: 'primary.main', fontWeight: 'bold' }}>
                          מעבד אירועים: {loadingProgress.current} מתוך {loadingProgress.total}
                        </Typography>
                      )}
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {group.name.replace(/\s*\(\d+\)\s*$/, '')}
                          </Typography>
                          <Chip
                            label={`${dayHe} ב${monthHe}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                          />
                          {/* Removed current occurrence tag as requested */}
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <EventIcon fontSize="small" />
                            סנכרון: {group.occurrences.length} שנים
                          </Typography>

                          {group.reminders.length > 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <NotificationsActiveIcon fontSize="small" />
                              תזכורות: {group.reminders.map(getReminderLabel).join(', ')}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <NotificationsActiveIcon fontSize="small" />
                              ללא תזכורת
                            </Typography>
                          )}
                        </Box>

                        {nextOccurrence && (
                          <Typography variant="subtitle2" color="success.main" sx={{ mt: 1.5, fontWeight: '600' }}>
                            מופע קרוב: {nextOccurrence.gregorianDateStr.split('-').reverse().join('/')}
                            {group.startNumber !== undefined && ` (מופע ${nextOccurrence.occurrenceNumber})`}
                          </Typography>
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(group)}
                          sx={{ borderRadius: '8px' }}
                        >
                          עריכה
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlinedIcon />}
                          onClick={() => handleDeleteClick(group)}
                          sx={{ borderRadius: '8px' }}
                        >
                          מחיקה
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => handleToggleExpand(group.groupId)}
                          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{ borderRadius: '8px' }}
                        >
                          {isExpanded ? 'הסתר מופעים' : 'הצג מופעים'}
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Collapsible list of generated occurrences */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ mt: 3, bgcolor: 'action.hover', borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, px: 1, fontWeight: 'bold' }}>פירוט מופעים מסונכרנים ביומן:</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <List dense sx={{ maxHeight: 240, overflowY: 'auto', pr: 0 }}>
                          {group.occurrences.map((occ) => {
                            const dateRev = occ.gregorianDateStr.split('-').reverse().join('/');
                            const hebrewParts = occ.formattedHebrewDate.split(' ');
                            const hebrewDateWithoutYear = hebrewParts.slice(0, -1).join(' ');
                            
                            return (
                              <ListItem key={occ.id} sx={{ borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {hebrewDateWithoutYear} - {dateRev}
                                    </Typography>
                                  }
                                  secondary={`מופע מספר ${occ.occurrenceNumber}`}
                                />
                                <IconButton 
                                  size="small" 
                                  title="פתח ביומן גוגל"
                                  href={`https://www.google.com/calendar/render?action=VIEW&eid=${btoa(occ.id + ' primary').replace(/=/g, '')}`}
                                  target="_blank"
                                  rel="noopener"
                                  sx={{ ml: 1 }}
                                >
                                  <LinkIcon fontSize="small" />
                                </IconButton>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Delete Choice Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>מחיקת אירוע עברי מהיומן</DialogTitle>
        <DialogContent>
          <DialogContentText>
            כיצד ברצונך למחוק את האירוע <strong>"{selectedGroupForDelete?.name}"</strong> מיומן גוגל?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit" variant="outlined" sx={{ borderRadius: '8px' }}>
            ביטול
          </Button>
          <Button onClick={() => executeDelete(false)} color="warning" variant="contained" sx={{ borderRadius: '8px' }}>
            מחיקת מופעים עתידיים בלבד (מהשנה הנוכחית והלאה)
          </Button>
          <Button onClick={() => executeDelete(true)} color="error" variant="contained" sx={{ borderRadius: '8px' }}>
            מחיקת כל המופעים (עבר ועתיד)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog 
        open={!!selectedGroupForEdit && tempEditValues === null} 
        onClose={() => setSelectedGroupForEdit(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 0 }}>עריכת אירוע</DialogTitle>
        <DialogContent>
          {selectedGroupForEdit && (
            <Box sx={{ mt: 2 }}>
              <EventForm
                initialValues={selectedGroupForEdit}
                buttonLabel="המשך לשמירה..."
                loading={false}
                onCancel={() => setSelectedGroupForEdit(null)}
                onSubmit={async (values) => {
                  setTempEditValues(values);
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Choice Dialog */}
      <Dialog open={tempEditValues !== null} onClose={() => setTempEditValues(null)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>עדכון אירועים ביומן</DialogTitle>
        <DialogContent>
          <DialogContentText>
            כיצד ברצונך להחיל את השינויים שבוצעו באירוע <strong>"{selectedGroupForEdit?.name}"</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
          <Button onClick={() => setTempEditValues(null)} color="inherit" variant="outlined" sx={{ borderRadius: '8px' }}>
            חזרה לעריכה
          </Button>
          <Button 
            onClick={() => handleTempEditSubmit(false)} 
            color="primary" 
            variant="contained" 
            sx={{ borderRadius: '8px' }}
          >
            עדכן מופעים עתידיים בלבד (מהשנה הנוכחית והלאה)
          </Button>
          <Button 
            onClick={() => handleTempEditSubmit(true)} 
            color="primary" 
            variant="contained" 
            sx={{ borderRadius: '8px' }}
          >
            עדכן את כל המופעים (עבר ועתיד)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
