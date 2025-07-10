import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  Stack,
} from "@mui/material";
import { Business as BuildingOfficeIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

import WorkAreaCard from "../../components/workAreaCard";

export interface WorkArea {
  id: string;
  name: string;
  description?: string;
  employeeCount: number;
  createdDate: string;
}

export interface WorkAreaFormState {
  name: string;
  description: string;
}

const initialWorkAreas: WorkArea[] = [
  {
    id: "1",
    name: "Development Team",
    employeeCount: 1,
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Product Strategy",
    employeeCount: 1,
    createdDate: "2024-01-20",
  },
];

const WorkAreaManagement: React.FC = () => {
  const [workAreas, setWorkAreas] = useState<WorkArea[]>(initialWorkAreas);
  const [showAddWorkArea, setShowAddWorkArea] = useState(false);
  const [editingWorkArea, setEditingWorkArea] = useState<WorkArea | null>(null);
  const [workAreaForm, setWorkAreaForm] = useState<WorkAreaFormState>({
    name: "",
    description: "",
  });

  const resetForm = () => {
    setWorkAreaForm({ name: "", description: "" });
    setShowAddWorkArea(false);
    setEditingWorkArea(null);
  };

  const handleAddWorkArea = () => {
    if (!workAreaForm.name.trim()) {
      alert("Work Area Name is required.");
      return;
    }

    const newWorkArea: WorkArea = {
      id: String((Math.random() + 1) * 100),
      name: workAreaForm.name.trim(),
      description: workAreaForm.description.trim() || undefined,
      employeeCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setWorkAreas((prev) => [...prev, newWorkArea]);
    resetForm();
  };

  const handleEditWorkArea = (workArea: WorkArea) => {
    setEditingWorkArea(workArea);
    setWorkAreaForm({
      name: workArea.name,
      description: workArea.description || "",
    });
    setShowAddWorkArea(true);
  };

  const handleUpdateWorkArea = () => {
    if (!editingWorkArea || !workAreaForm.name.trim()) {
      alert("Work Area Name is required for update.");
      return;
    }

    setWorkAreas((prev) =>
      prev.map((wa) =>
        wa.id === editingWorkArea.id
          ? {
              ...wa,
              name: workAreaForm.name.trim(),
              description: workAreaForm.description.trim() || undefined,
            }
          : wa
      )
    );
    resetForm();
  };

  const handleDeleteWorkArea = (id: string) => {
    const workAreaToDelete = workAreas.find((wa) => wa.id === id);
    if (workAreaToDelete && workAreaToDelete.employeeCount > 0) {
      alert(
        "Cannot delete work area with assigned employees. Please reassign employees first."
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this work area?")) {
      setWorkAreas((prev) => prev.filter((wa) => wa.id !== id));
      if (editingWorkArea?.id === id) {
        resetForm();
      }
    }
  };

  const cancelWorkAreaForm = () => {
    resetForm();
  };

  return (
    <Stack sx={{ maxWidth: "lg", mx: "auto", px: 3, pt: 2 }}>
      <AppBar
        position="static"
        color="inherit"
        sx={{ borderRadius: 2, py: 1, mb: 4 }}
        elevation={1}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
          }}
        >
          <Stack>
            <Typography variant="h5" component="h3" fontWeight="bold">
              Work Areas Management
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Manage and organize all work departments
            </Typography>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setShowAddWorkArea(true)}
          >
            Add Work Area
          </Button>
        </Toolbar>
      </AppBar>

      {/* {(showAddWorkArea || editingWorkArea) && (
        <AddEditWorkAreaCard
          workAreaForm={workAreaForm}
          setWorkAreaForm={setWorkAreaForm}
          editingWorkArea={editingWorkArea}
          onAdd={handleAddWorkArea}
          onUpdate={handleUpdateWorkArea}
          onCancel={cancelWorkAreaForm}
        />
      )} */}

      <Grid container spacing={3}>
        {workAreas.map((workArea) => (
          <Grid key={workArea.id}>
            <WorkAreaCard
              workArea={workArea}
              onEdit={handleEditWorkArea}
              onDelete={handleDeleteWorkArea}
            />
          </Grid>
        ))}
      </Grid>

      {workAreas.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <BuildingOfficeIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "medium", mb: 1 }}>
            No work areas found
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.500" }}>
            Add some work areas to organize your employees.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default WorkAreaManagement;
