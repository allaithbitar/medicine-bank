import { Box, Stack, Typography, TextField } from "@mui/material";
import useReducerState from "../../hooks/use-reducer.hook";

interface BeneficiaryAccount {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const initialBeneficiaryAccountData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};
const BeneficiaryAccountForm = () => {
  const [beneficiaryData, setBeneficiaryData] =
    useReducerState<BeneficiaryAccount>(initialBeneficiaryAccountData);

  const handleBeneficiaryChange = (
    field: keyof BeneficiaryAccount,
    value: string,
  ) => {
    setBeneficiaryData({ [field]: value });
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Personal Information
        </Typography>
        <Stack spacing={2}>
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
        <Stack spacing={2}>
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
        <Stack spacing={2}>
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
