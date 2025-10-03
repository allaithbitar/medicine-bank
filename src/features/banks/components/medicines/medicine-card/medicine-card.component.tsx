import CustomIconButton from "@/core/components/common/custom-icon-button/custom-icon-button.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import STRINGS from "@/core/constants/strings.constant";
import type { TMedicine } from "@/features/banks/types/medicines.types";
import { DeleteOutline, Edit } from "@mui/icons-material";
import { Box, Avatar, Typography, Stack, Tooltip } from "@mui/material";
import { teal, orange } from "@mui/material/colors";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { getStringsLabel } from "@/core/helpers/helpers";
const MedicineCard = ({
  medicine,
  onEdit,
}: {
  medicine: TMedicine;
  onEdit: (m: TMedicine) => void;
}) => {
  const headerContent = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", flexGrow: 1, minWidth: 0 }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <MedicalServicesIcon sx={{ color: "white" }} />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          color="white"
          fontWeight="semibold"
          noWrap
          sx={{ flexShrink: 1, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {medicine.name}
        </Typography>
      </Box>
      <Stack
        direction="row"
        gap={1}
        sx={{ color: "white", flexShrink: 0, ml: 2 }}
      >
        <Tooltip title={STRINGS.delete} arrow>
          <CustomIconButton disabled size="small">
            <DeleteOutline sx={{ color: "white" }} />
          </CustomIconButton>
        </Tooltip>
        <Tooltip title={STRINGS.edit} arrow>
          <CustomIconButton onClick={() => onEdit(medicine)} size="small">
            <Edit sx={{ color: "white" }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={`linear-gradient(to right, ${teal[400]}, ${orange[400]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            label={STRINGS.med_form}
            icon={<MedicationLiquidIcon />}
            value={getStringsLabel({ key: "med_form", val: medicine.form })}
          />
          <DetailItemComponent
            label={STRINGS.dose_variants}
            icon={<VaccinesIcon />}
            value={medicine.doseVariants.map((dv) => `${dv}mg`).join(" , ")}
          />
        </Stack>
      }
      footerContent={null}
    />
  );
};
export default MedicineCard;
