import Nodata from "@/core/components/common/no-data/no-data.component";
import { Grid } from "@mui/material";
import CityCard from "../city-card/city-card.component";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import { useCallback } from "react";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import type { TCity } from "@/features/banks/types/city.types";

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
      <Grid container gap={2} justifyContent="center">
        {cities.map((city) => (
          <Grid key={city.name}>
            <CityCard
              city={city}
              onEdit={() => onEdit(city)}
              onDelete={() => handleDeleteCity(city.name)}
            />
          </Grid>
        ))}
      </Grid>
      {cities.length === 0 && !isLoadingCities && (
        <Nodata
          icon={<BuildingOfficeIcon />}
          title="No Cities found"
          subTitle="Add some Cities to see them."
        />
      )}
    </>
  );
}

export default CitiesList;
