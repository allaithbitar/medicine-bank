import { Box, Stack, Typography, TextField } from "@mui/material";
import type { IBeneficiaryAccount } from "../types/beneficiary.types";
import useReducerState from "@/core/hooks/use-reducer.hook";

const initialBeneficiaryAccountData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};
const BeneficiaryAccountForm = () => {
  const [beneficiaryData, setBeneficiaryData] =
    useReducerState<IBeneficiaryAccount>(initialBeneficiaryAccountData);

  const handleBeneficiaryChange = (
    field: keyof IBeneficiaryAccount,
    value: string,
  ) => {
    setBeneficiaryData({ [field]: value });
  };

  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Personal Information
        </Typography>
        <Stack gap={2}>
          <TextField
            fullWidth
            label="First Name"
            required
            value={beneficiaryData.firstName}
            onChange={(e) =>
              handleBeneficiaryChange("firstName", e.target.value)
            }
          />
          <TextField
            fullWidth
            label="Last Name"
            required
            value={beneficiaryData.lastName}
            onChange={(e) =>
              handleBeneficiaryChange("lastName", e.target.value)
            }
          />
        </Stack>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Contact Information
        </Typography>
        <Stack gap={2}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            required
            value={beneficiaryData.email}
            onChange={(e) => handleBeneficiaryChange("email", e.target.value)}
          />
          <TextField
            fullWidth
            label="Phone"
            type="tel"
            value={beneficiaryData.phone}
            onChange={(e) => handleBeneficiaryChange("phone", e.target.value)}
          />
        </Stack>
      </Box>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Address
        </Typography>
        <Stack gap={2}>
          <TextField
            fullWidth
            label="Address"
            value={beneficiaryData.address}
            onChange={(e) => handleBeneficiaryChange("address", e.target.value)}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default BeneficiaryAccountForm;
