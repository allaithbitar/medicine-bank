import { Box, Avatar, Stack, Tooltip, Typography } from "@mui/material";
import { teal, orange } from "@mui/material/colors";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import Edit from "@mui/icons-material/Edit";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

import CustomIconButton from "@/core/components/common/custom-icon-button/custom-icon-button.component";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import STRINGS from "@/core/constants/strings.constant";
import type { TBeneficiaryMedicine } from "../../types/beneficiary.types";
import { getStringsLabel } from "@/core/helpers/helpers";

const BeneficiaryMedicineCard = ({
  item,
  onEdit,
}: {
  item: TBeneficiaryMedicine;
  onEdit: (bm: TBeneficiaryMedicine) => void;
}) => {
  const medicine = item.medicine;
  const dose = item.dosePerIntake;
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

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            color="white"
            fontWeight="semibold"
            noWrap
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {medicine?.name}
          </Typography>

          <Typography variant="caption" color="rgba(255,255,255,0.85)" noWrap>
            {getStringsLabel({ key: "med_form", val: medicine?.form })}
          </Typography>
        </Box>
      </Box>

      <Stack
        direction="row"
        gap={1}
        sx={{ color: "white", flexShrink: 0, ml: 2 }}
      >
        <Tooltip title={STRINGS.delete} arrow>
          <span>
            <CustomIconButton disabled size="small">
              <DeleteOutline sx={{ color: "white" }} />
            </CustomIconButton>
          </span>
        </Tooltip>
        <Tooltip title={STRINGS.edit} arrow>
          <CustomIconButton onClick={() => onEdit(item)} size="small">
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
            label={STRINGS.dose}
            icon={<VaccinesIcon />}
            value={`${dose}mg`}
          />
          <DetailItemComponent
            label={STRINGS.intake_frequency_per_day}
            icon={<MedicationLiquidIcon />}
            value={item.intakeFrequency}
          />
          {item.note ? (
            <DetailItemComponent
              label={STRINGS.note}
              icon={<MedicalServicesIcon />}
              value={item.note}
            />
          ) : null}
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default BeneficiaryMedicineCard;
