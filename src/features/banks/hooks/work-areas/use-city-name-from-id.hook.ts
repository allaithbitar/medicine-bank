import { useEffect, useState } from 'react';
import citiesApi from '../../api/cities-api/cities.api';
import { notifyError } from '@/core/components/common/toast/toast';

export const useCityName = (cityId: string) => {
  const [cityName, setCityName] = useState('');
  const { data, isError, error } = citiesApi.useGetCitiesInfiniteQuery({});

  const cities = data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    if (cities && cityId) {
      const foundCity = cities.find((c: any) => c.id === cityId);
      setCityName(foundCity?.name || '');
    } else {
      setCityName('');
    }
  }, [cities, cityId]);

  useEffect(() => {
    if (isError) {
      notifyError();
    }
  }, [isError, error]);

  return cityName;
};
