import Nodata from '@/core/components/common/no-data/no-data.component';
import { Business as BuildingOfficeIcon } from '@mui/icons-material';
import type { TCity } from '@/features/banks/types/city.types';
import STRINGS from '@/core/constants/strings.constant';

interface ICitiesList {
  cities: TCity[];
  isLoadingCities: boolean;
}

function CitiesList({ cities, isLoadingCities }: ICitiesList) {
  return (
    <>
      {cities.length === 0 && !isLoadingCities && (
        <Nodata icon={BuildingOfficeIcon} title={STRINGS.no_cities_found} subTitle={STRINGS.add_to_see} />
      )}
    </>
  );
}

export default CitiesList;
