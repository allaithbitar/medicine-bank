import SearchFilter from '@/core/components/common/search-filter/search-filter.component';
import { Stack, Collapse } from '@mui/material';
import { useState, type Dispatch, type SetStateAction } from 'react';
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import CustomAppBar from '@/core/components/common/custom-app-bar/custom-app-bar.component';
import STRINGS from '@/core/constants/strings.constant';
import CitiesAutocomplete from '../../cities/cities-autocomplete/cities-autocomplete.component';
import type { TAutocompleteItem } from '@/core/types/common.types';

interface IWorkAreasAppBar {
  handleSearch: (query: string) => void;
  setSelectedCity: Dispatch<SetStateAction<TAutocompleteItem | null>>;
  selectedCity: TAutocompleteItem | null;
}

function WorkAreasAppBar({ handleSearch, setSelectedCity, selectedCity }: IWorkAreasAppBar) {
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <CustomAppBar
      title={STRINGS.work_areas}
      subtitle={STRINGS.work_areas_subtitle}
      actions={
        <CustomIconButton onClick={toggleFilters}>
          <FilterListIcon />
        </CustomIconButton>
      }
    >
      <Collapse in={showFilters} sx={{ width: '100%' }}>
        <Stack flexDirection="row" gap={1} sx={{ mt: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <CitiesAutocomplete
            multiple={false}
            value={selectedCity}
            onChange={(v) => setSelectedCity(v)}
            disableClearable={false}
          />
          <SearchFilter initialQuery={''} onSearch={handleSearch} placeholder={STRINGS.search_work_area} />
        </Stack>
      </Collapse>
    </CustomAppBar>
  );
}

export default WorkAreasAppBar;
