import { Box, Avatar, Stack, Tooltip, Typography } from '@mui/material';
import { indigo, deepPurple } from '@mui/material/colors';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import { Edit } from '@mui/icons-material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

import STRINGS from '@/core/constants/strings.constant';
import type { TSystemBroadcast } from '../types/system-broadcasts.types';
import { formatDateTime } from '@/core/helpers/helpers';

const SystemBroadcastCard = ({
  broadcast,
  onEdit,
}: {
  broadcast: TSystemBroadcast;
  onEdit: (b: TSystemBroadcast) => void;
}) => {
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
          <AnnouncementIcon sx={{ color: 'white' }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            color="white"
            fontWeight="semibold"
            noWrap
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {broadcast.title}
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

        <Tooltip title={STRINGS.edit} arrow>
          <CustomIconButton onClick={() => onEdit(broadcast)} size="small">
            <Edit sx={{ color: 'white' }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${indigo[400]}, ${deepPurple[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent label={STRINGS.details} icon={<TextSnippetOutlinedIcon />} value={broadcast.details} />
          {broadcast.createdAt ? (
            <DetailItemComponent
              label={STRINGS.created_at}
              icon={<EventNoteIcon />}
              value={formatDateTime(broadcast.createdAt)}
            />
          ) : null}
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default SystemBroadcastCard;
