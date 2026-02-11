import { Stack } from '@mui/material';
// import { lightBlue, blue } from '@mui/material/colors';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import { Edit } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import type { TMeeting } from '../types/meetings.types';
import { formatDateTime } from '@/core/helpers/helpers';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

const MeetingCard = ({ meeting, onEdit }: { meeting: TMeeting; onEdit?: (m: TMeeting) => void }) => {
  const headerContent = (
    <CardAvatar
      name={meeting.note}
      icon={<EventIcon />}
      actions={onEdit ? [{ icon: <Edit />, onClick: () => onEdit(meeting) }] : undefined}
    />
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      // headerBackground={`linear-gradient(to right, ${blue[400]}, ${lightBlue[500]})`}
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
