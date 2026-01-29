import Nodata from '@/core/components/common/no-data/no-data.component';
import STRINGS from '@/core/constants/strings.constant';
import type { TMedicine } from '@/features/banks/types/medicines.types';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const MedicinesList = ({
  medicines,
  isLoadingMedicines,
}: {
  medicines: TMedicine[];
  isLoadingMedicines: boolean;
  onEditMedicine: (m: TMedicine) => void;
}) => {
  return (
    <>
      {medicines.length === 0 && !isLoadingMedicines && (
        <Nodata icon={MedicalServicesIcon} title={STRINGS.no_medicines_found} subTitle={STRINGS.add_to_see} />
      )}
    </>
  );
};

export default MedicinesList;
