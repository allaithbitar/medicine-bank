import EditIcon from '@mui/icons-material/Edit';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { LocationCity, LocationPin, PersonPin } from '@mui/icons-material';
import type { TCityWithData } from '@/features/banks/types/city.types';
// import { indigo, lightBlue } from '@mui/material/colors';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { Stack } from '@mui/material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import STRINGS from '@/core/constants/strings.constant';

interface ICityCardProps {
  city: TCityWithData;
  onEdit?: () => void;
}

const CityCard = ({ city, onEdit }: ICityCardProps) => {
  const headerContent = (
    <CardAvatar
      name={city.name}
      icon={<LocationCity />}
      actions={onEdit ? [{ icon: <EditIcon />, onClick: onEdit }] : undefined}
    />
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent icon={<LocationPin />} label={STRINGS.areas} value={city.areasCount} />
          <DetailItemComponent icon={<PersonPin />} label={STRINGS.employees} value={city.employeesCount} />
        </Stack>
      }
      footerContent={null}
      // headerBackground={`linear-gradient(to right, ${lightBlue[300]}, ${indigo[300]})`}
    />
  );
};

export default CityCard;
