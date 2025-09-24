import medicinesApi from "../../api/medicines-api/medicines-api";
import CustomAppBarComponent from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import STRINGS from "@/core/constants/strings.constant";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { Stack } from "@mui/material";
import MedicinesList from "../../components/medicines/medicines-list/medicines-list.component";
import { Add } from "@mui/icons-material";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import { useCallback, useState } from "react";
import type { TMedicine } from "../../types/medicines.types";
import { useModal } from "@/core/components/common/modal/modal-provider.component";

const MedicinesPage = () => {
  const [query, setQuery] = useState<string | null>("");
  const { openModal } = useModal();

  const {
    data: { items: medicines = [] } = { items: [] },
    isLoading: isLoadingMedicines,
  } = medicinesApi.useGetMedicinesQuery({ name: query });

  const handleOpenMedicineModal = (oldMedicine?: TMedicine) => {
    openModal({
      name: "MEDICINE_FORM_MODAL",
      props: { oldMedicine },
    });
  };

  const handleSearch = useCallback((query: string | null) => {
    setQuery(query);
  }, []);

  return (
    <Stack gap={2} sx={{ height: "100%" }}>
      <CustomAppBarComponent
        title={STRINGS.medicines_management}
        subtitle={STRINGS.add_manage_medicines}
        children={
          <SearchFilter
            initialQuery={query}
            onSearch={handleSearch}
            placeholder={STRINGS.search_med}
          />
        }
      />

      <MedicinesList
        onEditMedicine={handleOpenMedicineModal}
        isLoadingMedicines={isLoadingMedicines}
        medicines={medicines}
      />

      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenMedicineModal(),
          },
        ]}
      />
    </Stack>
  );
};

export default MedicinesPage;
