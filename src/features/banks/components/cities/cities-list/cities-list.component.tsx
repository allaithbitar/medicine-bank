import Nodata from "@/core/components/common/no-data/no-data.component";
import CityCard from "../city-card/city-card.component";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import { useCallback } from "react";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TCity } from "@/features/banks/types/city.types";
import STRINGS from "@/core/constants/strings.constant";
import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";

interface ICitiesList {
  onEdit: (city: TCity) => void;
  cities: TCity[];
  isLoadingCities: boolean;
}

function CitiesList({ onEdit, cities, isLoadingCities }: ICitiesList) {
  const { openModal } = useModal();

  const handleDeleteCity = useCallback((name: string) => {
    openModal({
      name: "CONFIRM_MODAL",
      props: {
        message: "Are you sure you want to delete this item?",
        onConfirm: () => {
          console.log("🚀 ~ handleDeleteWorkAreaClick ~ id:", name);
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {cities.length === 0 && !isLoadingCities && (
        <Nodata
          icon={BuildingOfficeIcon}
          title={STRINGS.no_cities_found}
          subTitle={STRINGS.add_to_see}
        />
      )}
      <VirtualizedList
        isLoading={isLoadingCities}
        items={cities}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{
          count: cities.length,
        }}
      >
        {({ item: city }) => {
          return (
            <CityCard
              city={city}
              onEdit={() => onEdit(city)}
              onDelete={() => handleDeleteCity(city.name)}
            />
          );
        }}
      </VirtualizedList>
    </>
  );
}

export default CitiesList;
