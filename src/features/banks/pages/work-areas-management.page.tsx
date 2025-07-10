import React, { useCallback } from "react";
import { Box, Typography, AppBar, Toolbar, Stack, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchFilter from "@/core/components/common/search-filter/search-filter.component";
import WorkAreasLists from "../components/work-area-lists/work-area-lists.component";

const WorkAreaManagement: React.FC = () => {
  const handleSearch = useCallback((query: string) => {
    console.log("🚀 ~ handleSearch ~ query:", query);
  }, []);

  const handleAddWorkArea = () => {
    console.log("add");
  };

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
                Work Areas Management
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Manage and organize all work departments
              </Typography>
            </Box>
          </Stack>
          <SearchFilter
            onSearch={handleSearch}
            placeholder="Search Work Areas..."
          />
        </Toolbar>
      </AppBar>
      <WorkAreasLists />
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={handleAddWorkArea}
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};

export default WorkAreaManagement;
