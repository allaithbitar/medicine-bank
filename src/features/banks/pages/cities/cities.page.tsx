import { useCallback, useState } from "react";
import { Stack } from "@mui/material";
import { useModal } from "@/core/components/common/modal/modal-provider.component";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import CitiesList from "../../components/cities/cities-list/cities-list.component";
import type { TCity } from "../../types/city.types";
import citiesApi from "../../api/cities-api/cities.api";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";

const CitiesPage = () => {
  const { openModal } = useModal();
  const [query, setQuery] = useState<string | null>("");
  const {
    data: { items: cities = [] } = { items: [] },
    isLoading: isLoadingCities,
  } = citiesApi.useGetCitiesQuery({});

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
    <Stack gap={2} sx={{ height: "100%" }}>
      <CustomAppBar
        title={STRINGS.city_management}
        subtitle={STRINGS.add_and_manage_cities}
        children={
          <SearchFilter
            initialQuery={query}
            onSearch={handleSearch}
            placeholder={STRINGS.search_city}
          />
        }
      />
      <CitiesList
        isLoadingCities={isLoadingCities}
        cities={cities}
        onEdit={handleOpenCityModal}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenCityModal(),
          },
        ]}
      />
    </Stack>
  );
};

export default CitiesPage;
