// src/components/SearchFilter.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import useDebounce from '@/core/hooks/use-debounce.hook';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery: string | null;
  debounceDelay?: number;
}

const SearchFilter = ({
  onSearch,
  placeholder = 'Search...',
  initialQuery = null,
  debounceDelay = 300,
}: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState<string | null>(initialQuery);
  const debouncedSearchTerm = useDebounce<string>(searchTerm || '', debounceDelay);

  useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchFilter;
