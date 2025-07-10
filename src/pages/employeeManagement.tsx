// src/pages/EmployeeManagement.tsx
import { AppBar, Typography, Toolbar, Stack, Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../components/common/searchFilter";
import EmployeeCards from "../components/employeeCards";

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const handleAddEmployee = useCallback(() => {
    navigate(`/employee-management/manage`);
  }, [navigate]);

  const handleSearch = useCallback((query: string) => {
    console.log("🚀 ~ handleSearch ~ query:", query);
  }, []);

  return (
    <Stack sx={{ maxWidth: "md", mx: "auto", mt: 2 }}>
      <AppBar
        position="static"
        color="inherit"
        sx={{ borderRadius: 1, py: 1, mb: 2 }}
        elevation={0}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack
            sx={{
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h5" component="h3">
                Account Management
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Manage employee accounts
              </Typography>
            </Box>
          </Stack>
          <SearchFilter
            onSearch={handleSearch}
            placeholder="Search employees..."
          />
        </Toolbar>
      </AppBar>
      <EmployeeCards />
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
