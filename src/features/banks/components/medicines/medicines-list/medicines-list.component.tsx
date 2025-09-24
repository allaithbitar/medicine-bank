import Nodata from "@/core/components/common/no-data/no-data.component";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";
import STRINGS from "@/core/constants/strings.constant";
import type { TMedicine } from "@/features/banks/types/medicines.types";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicineCard from "../medicine-card/medicine-card.component";

const MedicinesList = ({
  medicines,
  isLoadingMedicines,
  onEditMedicine,
}: {
  medicines: TMedicine[];
  isLoadingMedicines: boolean;
  onEditMedicine: (m: TMedicine) => void;
}) => {
  return (
    <>
      {medicines.length === 0 && !isLoadingMedicines && (
        <Nodata
          icon={MedicalServicesIcon}
          title={STRINGS.no_medicines_found}
          subTitle={STRINGS.add_to_see}
        />
      )}

      <VirtualizedList
        isLoading={isLoadingMedicines}
        items={medicines}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{ count: medicines.length }}
      >
        {({ item: med }) => {
          return <MedicineCard onEdit={onEditMedicine} medicine={med} />;
        }}
      </VirtualizedList>
    </>
  );
};

export default MedicinesList;
