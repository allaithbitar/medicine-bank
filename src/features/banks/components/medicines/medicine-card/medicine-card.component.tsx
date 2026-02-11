import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import STRINGS from '@/core/constants/strings.constant';
import type { TMedicine } from '@/features/banks/types/medicines.types';
import { Edit } from '@mui/icons-material';
import { Stack } from '@mui/material';
// import { teal, orange } from '@mui/material/colors';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { getStringsLabel } from '@/core/helpers/helpers';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
const MedicineCard = ({ medicine, onEdit }: { medicine: TMedicine; onEdit?: (m: TMedicine) => void }) => {
  const headerContent = (
    <CardAvatar
      name={medicine.name}
      icon={<MedicalServicesIcon />}
      actions={onEdit ? [{ icon: <Edit />, onClick: () => onEdit(medicine) }] : undefined}
    />
  );
  return (
    <ReusableCardComponent
      headerContent={headerContent}
      // headerBackground={`linear-gradient(to right, ${teal[400]}, ${orange[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            label={STRINGS.med_form}
            icon={<MedicationLiquidIcon />}
            value={getStringsLabel({ key: 'med_form', val: medicine.form })}
          />
          <DetailItemComponent
            label={STRINGS.dose_variants}
            icon={<VaccinesIcon />}
            value={medicine.doseVariants.map((dv) => `${dv}mg`).join(' , ') || STRINGS.undefined}
          />
        </Stack>
      }
      footerContent={null}
    />
  );
};
export default MedicineCard;
