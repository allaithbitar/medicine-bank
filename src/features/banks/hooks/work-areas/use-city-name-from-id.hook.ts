import { useEffect, useState } from "react";
import citiesApi from "../../api/cities-api/cities.api";
import { notifyError } from "@/core/components/common/toast/toast";

export const useCityName = (cityId: string) => {
  const [cityName, setCityName] = useState("");
  const [
    getCities,
    { data: { items: cities = [] } = { items: [] }, isError, error },
  ] = citiesApi.useLazyGetCitiesQuery();

  useEffect(() => {
    if (cityId) {
      getCities({ name: "" }, true);
    } else {
      setCityName("");
    }
  }, [cityId, getCities]);

  useEffect(() => {
    if (cities && cityId) {
      const foundCity = cities.find((c) => c.id === cityId);
      setCityName(foundCity?.name || "");
    }
  }, [cities, cityId]);

  useEffect(() => {
    if (isError) {
      notifyError();
    }
  }, [isError, error]);

  return cityName;
};
