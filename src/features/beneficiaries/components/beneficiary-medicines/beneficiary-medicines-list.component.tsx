import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import Nodata from '@/core/components/common/no-data/no-data.component';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import STRINGS from '@/core/constants/strings.constant';
import type { TBeneficiaryMedicine } from '../../types/beneficiary.types';
import BeneficiaryMedicineCard from './beneficiary-medicine-card.component';
import { Button, Card } from '@mui/material';

const BeneficiaryMedicinesList = ({
  items,
  isLoading,
  onEdit,
}: {
  items: TBeneficiaryMedicine[];
  isLoading: boolean;
  onEdit: (bm: TBeneficiaryMedicine) => void;
}) => {
  return (
    <>
      {items.length === 0 && !isLoading && (
        <Card>
          <Nodata
            icon={MedicalServicesIcon}
            title={STRINGS.no_medicines_found}
            extra={<Button>{STRINGS.add}</Button>}
          />
        </Card>
      )}

      <VirtualizedList
        isLoading={isLoading}
        items={items}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{ count: items.length }}
      >
        {({ item }) => {
          return <BeneficiaryMedicineCard item={item} onEdit={onEdit} />;
        }}
      </VirtualizedList>
    </>
  );
};

export default BeneficiaryMedicinesList;
