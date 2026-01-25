import EditIcon from '@mui/icons-material/Edit';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { Business as BuildingOfficeIcon } from '@mui/icons-material';
import type { TCity } from '@/features/banks/types/city.types';
import { indigo, lightBlue } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

interface ICityCardProps {
  city: TCity;
  onEdit: () => void;
}

const CityCard = ({ city, onEdit }: ICityCardProps) => {
  const headerContent = (
    <CardAvatar name={city.name} icon={<BuildingOfficeIcon />} actions={[{ icon: <EditIcon />, onClick: onEdit }]} />
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={null}
      footerContent={null}
      headerBackground={`linear-gradient(to right, ${lightBlue[300]}, ${indigo[300]})`}
    />
  );
};

export default CityCard;
