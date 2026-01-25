import EditIcon from '@mui/icons-material/Edit';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import type { TPriorityDegree } from '../types/priority-degree.types';
import { indigo } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

interface IProps {
  priorityDegree: TPriorityDegree;
  onEdit: () => void;
}

const PriorityDegreeCard = ({ priorityDegree, onEdit }: IProps) => {
  const headerContent = <CardAvatar name={priorityDegree.name} actions={[{ icon: <EditIcon />, onClick: onEdit }]} />;

  const headerBackground =
    priorityDegree.color && priorityDegree.color.trim() !== '' ? priorityDegree.color : indigo[300];

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={null}
      footerContent={null}
      headerBackground={headerBackground}
    />
  );
};

export default PriorityDegreeCard;
