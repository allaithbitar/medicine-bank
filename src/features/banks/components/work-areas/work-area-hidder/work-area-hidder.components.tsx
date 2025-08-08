import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import { Stack, Collapse } from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CustomIconButton from "@/core/components/common/custom-icon-button/custom-icon-button.component";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";

interface IWorkAreasAppBar {
  handleSearch: (query: string | null) => void;
  setSelectedCityId: Dispatch<SetStateAction<string>>;
  selectedCityId: string;
}

function WorkAreasAppBar({
  handleSearch,
  // setSelectedCityId,
  // selectedCityId,
}: IWorkAreasAppBar) {
  const [showFilters, setShowFilters] = useState(true);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <CustomAppBar
      title="Work Areas Management"
      subtitle="Manage and organize all work departments"
      actions={
        <CustomIconButton onClick={toggleFilters}>
          <FilterListIcon />
        </CustomIconButton>
      }
    >
      <Collapse in={showFilters} sx={{ width: "100%" }}>
        <Stack
          flexDirection="row"
          gap={1}
          sx={{ mt: 2, justifyContent: "flex-end", flexWrap: "wrap" }}
        >
          <SearchFilter
            initialQuery={""}
            onSearch={handleSearch}
            placeholder="Search Work Areas..."
          />
        </Stack>
      </Collapse>
    </CustomAppBar>
  );
}

export default WorkAreasAppBar;
