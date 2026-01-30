import { Stack } from '@mui/material';
import { indigo, deepPurple } from '@mui/material/colors';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import { Edit } from '@mui/icons-material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';

import STRINGS from '@/core/constants/strings.constant';
import type { TSystemBroadcast } from '../types/system-broadcasts.types';
import { formatDateTime } from '@/core/helpers/helpers';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

const SystemBroadcastCard = ({
  broadcast,
  onEdit,
}: {
  broadcast: TSystemBroadcast;
  onEdit?: (b: TSystemBroadcast) => void;
}) => {
  const headerContent = (
    <CardAvatar
      name={broadcast.title ?? STRINGS.none}
      icon={<AnnouncementIcon />}
      actions={onEdit ? [{ icon: <Edit />, onClick: () => onEdit(broadcast) }] : undefined}
    />
  );
  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${indigo[400]}, ${deepPurple[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            label={STRINGS.details}
            icon={<TextSnippetOutlinedIcon />}
            value={broadcast.details ?? STRINGS.none}
          />
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
