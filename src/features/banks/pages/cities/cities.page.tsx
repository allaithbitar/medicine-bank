import { useCallback, useState } from "react";
import { Stack } from "@mui/material";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import CitiesList from "../../components/cities/cities-list/cities-list.component";
import type { TCity } from "../../types/city.types";
import citiesApi from "../../api/cities-api/cities.api";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";
import STRINGS from "@/core/constants/strings.constant";
import { Add } from "@mui/icons-material";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { useNavigate } from "react-router-dom";

const CitiesPage = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState<string | null>("");
  const {
    data: { items: cities = [] } = { items: [] },
    isLoading: isLoadingCities,
  } = citiesApi.useGetCitiesQuery({
    name: query,
  });

  const handleOpenCityActionPage = (oldCity?: TCity) => {
    navigate(`/cities/action`, { state: { oldCity } });
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
        onEdit={handleOpenCityActionPage}
      />
      <ActionsFab
        actions={[
          {
            label: STRINGS.add,
            icon: <Add />,
            onClick: () => handleOpenCityActionPage(),
          },
        ]}
      />
    </Stack>
  );
};

export default CitiesPage;
