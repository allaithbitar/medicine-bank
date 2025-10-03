import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
  Card,
} from "@mui/material";
import { red, green, orange } from "@mui/material/colors";
import * as z from "zod";
import type {
  TAddPriorityDegreeDto,
  TUpdatePriorityDegreeDto,
} from "../types/priority-degree.types";
import priorityDegreesApi from "../api/priority-degrees.api";
import {
  notifyError,
  notifySuccess,
} from "@/core/components/common/toast/toast";
import STRINGS from "@/core/constants/strings.constant";
import useReducerState from "@/core/hooks/use-reducer.hook";
import { useLocation, useNavigate } from "react-router-dom";
import ActionFab from "@/core/components/common/action-fab/acion-fab.component";
import { Save } from "@mui/icons-material";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const PriorityDegreeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  color: z.string().min(1, { message: "color is required" }),
});

type TFormValues = z.infer<typeof PriorityDegreeSchema>;

const COLOR_GROUPS = {
  red: Object.values(red).filter((v) => typeof v === "string") as string[],
  orange: Object.values(orange).filter(
    (v) => typeof v === "string"
  ) as string[],
  green: Object.values(green).filter((v) => typeof v === "string") as string[],
};

const FLAT_COLORS: { color: string; group: string; label: string }[] = [
  ...COLOR_GROUPS.red.map((c, i) => ({
    color: c,
    group: "red",
    label: `red-${i}`,
  })),

  ...COLOR_GROUPS.orange.map((c, i) => ({
    color: c,
    group: "orange",
    label: `orange-${i}`,
  })),
  ...COLOR_GROUPS.green.map((c, i) => ({
    color: c,
    group: "green",
    label: `green-${i}`,
  })),
];

const PriorityDegreesActionPage = () => {
  const navigate = useNavigate();
  const { state: old } = useLocation();
  const oldPriorityDegree = old?.oldPriorityDegree;

  const [updatePriorityDegree, { isLoading: isUpdating }] =
    priorityDegreesApi.useUpdatePriorityDegreeMutation({});
  const [addPriorityDegree, { isLoading: isAdding }] =
    priorityDegreesApi.useAddPriorityDegreeMutation({});

  const [values, setValues] = useReducerState<TFormValues>({
    name: oldPriorityDegree?.name ?? "",
    color: oldPriorityDegree?.color ?? green[700],
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const getErrorForField = (field: keyof TFormValues) => {
    const err = errors.find((e) => e.path[0] === field);
    return err ? err.message : "";
  };

  const handleNameChange = (val: string) => {
    setValues({ name: val });
    setErrors((prev) => prev.filter((e) => e.path[0] !== "name"));
  };

  const handleColorChange = (e: SelectChangeEvent<string>) => {
    const v = e.target.value || "";
    setValues({ color: v });
  };

  const handleSubmit = async () => {
    try {
      const parsed = PriorityDegreeSchema.parse(values);
      if (oldPriorityDegree) {
        const payload: TUpdatePriorityDegreeDto = {
          id: oldPriorityDegree.id,
          name: parsed.name,
          color: parsed.color ?? undefined,
        };
        await updatePriorityDegree(payload).unwrap();
      } else {
        const payload: TAddPriorityDegreeDto = {
          name: parsed.name,
          color: parsed.color ?? undefined,
        };
        await addPriorityDegree(payload).unwrap();
      }
      notifySuccess(
        oldPriorityDegree
          ? STRINGS.edited_successfully
          : STRINGS.added_successfully
      );
      navigate(-1);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setErrors(err.errors);
        return;
      }
      notifyError(err);
    }
  };

  const isLoading = isAdding || isUpdating;

  return (
    <Card>
      <Typography sx={{ pb: 2 }}>
        {oldPriorityDegree ? STRINGS.edit : STRINGS.add}
      </Typography>
      <Stack gap={2}>
        <TextField
          fullWidth
          label={STRINGS.name}
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          error={!!getErrorForField("name")}
          helperText={getErrorForField("name")}
        />

        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {STRINGS.select_color_optional}
          </Typography>

          <Select
            fullWidth
            value={values.color}
            onChange={handleColorChange}
            displayEmpty
            renderValue={(selected) => {
              const found = FLAT_COLORS.find((f) => f.color === selected);
              const groupLabel = found ? found.group : "color";
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 14,
                      bgcolor: selected as string,
                      borderRadius: 0.5,
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {groupLabel} —{" "}
                    <Typography component="span" variant="body2">
                      {selected}
                    </Typography>
                  </Typography>
                </Box>
              );
            }}
            sx={{ minWidth: 160 }}
          >
            {FLAT_COLORS.map((c) => (
              <MenuItem key={c.color} value={c.color}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Box
                    sx={{
                      width: 28,
                      height: 18,
                      bgcolor: c.color,
                      borderRadius: 0.5,
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize", minWidth: 60 }}
                  >
                    {c.group}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.color}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
          <Typography>{STRINGS.quick_access}</Typography>
          <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
            {[red[700], orange[700], green[700]].map((c) => (
              <Box
                key={c}
                onClick={() => setValues({ color: c })}
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: c,
                  borderRadius: 1,
                  cursor: "pointer",
                  border:
                    values.color === c
                      ? "2px solid rgba(0,0,0,0.2)"
                      : "1px solid rgba(0,0,0,0.08)",
                }}
                title={c}
              />
            ))}
          </Stack>
        </Box>
      </Stack>
      <ActionFab
        icon={<Save />}
        color="success"
        onClick={handleSubmit}
        disabled={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default PriorityDegreesActionPage;
