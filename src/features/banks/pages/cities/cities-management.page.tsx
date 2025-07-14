import { useCallback, useState } from "react";
import { Stack, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { useModal } from "@/core/components/common/modal/modal-provider.component";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import CitiesList from "../../components/cities/cities-list/cities-list.component";
import type { TCity } from "../../types/city.types";
import citiesApi from "../../api/cities-api/cities.api";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";

const CitiesPage = () => {
  const { openModal } = useModal();
  const [query, setQuery] = useState<string | null>("");
  const {
    data: { items: cities = [] } = { items: [] },
    isLoading: isLoadingCities,
  } = citiesApi.useGetCitiesQuery({ name: query });

  const handleOpenCityModal = (oldCity?: TCity) => {
    openModal({
      name: "CITY_FORM_MODAL",
      props: {
        oldCity,
      },
    });
  };

  const handleSearch = useCallback((query: string | null) => {
    setQuery(query);
  }, []);

  return (
    <Stack gap={2}>
      {isLoadingCities && <LoadingOverlay />}
      <CustomAppBar
        title="Manage Cities"
        subtitle="Add and Manage all Cities"
        children={
          <SearchFilter
            initialQuery={query}
            onSearch={handleSearch}
            placeholder="Search Work Areas..."
          />
        }
      />
      <CitiesList
        isLoadingCities={isLoadingCities}
        cities={cities}
        onEdit={handleOpenCityModal}
      />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleOpenCityModal()}
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};

export default CitiesPage;
