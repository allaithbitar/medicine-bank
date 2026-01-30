import { Box, Avatar, Stack, Tooltip, Typography } from '@mui/material';
import { lightBlue, blue } from '@mui/material/colors';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import { Edit } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

import STRINGS from '@/core/constants/strings.constant';
import type { TMeeting } from '../types/meetings.types';
import { formatDateTime } from '@/core/helpers/helpers';

const MeetingCard = ({ meeting, onEdit }: { meeting: TMeeting; onEdit?: (m: TMeeting) => void }) => {
  const headerContent = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <EventIcon sx={{ color: 'white' }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            color="white"
            fontWeight="semibold"
            noWrap
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {meeting.note}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
        {/* <Tooltip title={STRINGS.delete} arrow>
          <span>
            <CustomIconButton disabled size="small">
              <DeleteOutline sx={{ color: "white" }} />
            </CustomIconButton>
          </span>
        </Tooltip> */}

        {onEdit && (
          <Tooltip title={STRINGS.edit} arrow>
            <CustomIconButton onClick={() => onEdit(meeting)} size="small">
              <Edit sx={{ color: 'white' }} />
            </CustomIconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${blue[400]}, ${lightBlue[500]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent label={STRINGS.note} icon={<TextSnippetOutlinedIcon />} value={meeting.note} />
          {meeting.date && (
            <DetailItemComponent label={STRINGS.date} icon={<EventNoteIcon />} value={formatDateTime(meeting.date)} />
          )}
          {meeting.createdAt && (
            <DetailItemComponent
              label={STRINGS.created_at}
              icon={<EventNoteIcon />}
              value={formatDateTime(meeting.createdAt)}
            />
          )}
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default MeetingCard;
