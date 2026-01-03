import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import { Fab, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeesList from "../components/employee-lists/employee-lists.component";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "@/core/components/common/custom-app-bar/custom-app-bar.component";

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string | null>("");
  const handleAddEmployee = useCallback(() => {
    navigate(`/employee/manage/add`);
  }, [navigate]);

  const handleSearch = useCallback((query: string | null) => {
    setQuery(query);
  }, []);

  return (
    <Stack gap={2}>
      <CustomAppBar
        title="Account Management"
        subtitle="Manage employee accounts"
        children={
          <SearchFilter
            initialQuery={query}
            onSearch={handleSearch}
            placeholder="Search employees..."
          />
        }
      />

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={handleAddEmployee}
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};
export default EmployeeManagement;
