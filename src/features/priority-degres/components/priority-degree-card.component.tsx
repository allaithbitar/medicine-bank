import EditIcon from '@mui/icons-material/Edit';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import type { TPriorityDegree } from '../types/priority-degree.types';
import { indigo } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { Typography } from '@mui/material';
import STRINGS from '@/core/constants/strings.constant';
import { AccessTime } from '@mui/icons-material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';

interface IProps {
  priorityDegree: TPriorityDegree;
  onEdit?: () => void;
}

const PriorityDegreeCard = ({ priorityDegree, onEdit }: IProps) => {
  const headerContent = (
    <CardAvatar name={priorityDegree.name} actions={onEdit ? [{ icon: <EditIcon />, onClick: onEdit }] : undefined} />
  );

  const headerBackground =
    priorityDegree.color && priorityDegree.color.trim() !== '' ? priorityDegree.color : indigo[300];

  const bodyContent = (
    <DetailItemComponent
      icon={<AccessTime />}
      iconColorPreset="deepPurple"
      label={STRINGS.duration_in_days}
      value={
        priorityDegree.durationInDays ? (
          <Typography variant="body2">
            <strong>{priorityDegree.durationInDays}</strong>{' '}
            {priorityDegree.durationInDays === 1 ? STRINGS.day : STRINGS.days}
          </Typography>
        ) : (
          STRINGS.none
        )
      }
    />
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={null}
      headerBackground={headerBackground}
    />
  );
};

export default PriorityDegreeCard;
