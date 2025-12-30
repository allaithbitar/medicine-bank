import { useRef } from "react";
import ModalWrapper from "../../../core/components/common/modal/modal-wrapper.component";
import BeneficiariesFilters, {
  type TBeneficiariesFiltersHandlers,
} from "./beneficiaries-filters.component";
import { Button, Stack } from "@mui/material";
import { Close, FilterAltOff, Search } from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import type { TGetBeneficiariesDto } from "../types/beneficiary.types";
import { useModal } from "@/core/components/common/modal/modal-provider.component";

const BeneficiariesFiltersModal = ({
  onSubmit,
}: {
  onSubmit: (values: Partial<TGetBeneficiariesDto>) => void;
}) => {
  const { closeModal } = useModal();

  const ref = useRef<TBeneficiariesFiltersHandlers>(null);

  return (
    <ModalWrapper
      actionButtons={
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Close />}
            onClick={() => closeModal()}
          >
            {STRINGS.close}
          </Button>

          <Button
            variant="outlined"
            startIcon={<FilterAltOff />}
            onClick={() => onSubmit(ref.current!.reset())}
          >
            {STRINGS.clear}
          </Button>

          <Button
            startIcon={<Search />}
            onClick={() => onSubmit(ref.current!.getValues())}
          >
            {STRINGS.search}
          </Button>
        </Stack>
      }
    >
      <BeneficiariesFilters ref={ref} />
    </ModalWrapper>
  );
};

export default BeneficiariesFiltersModal;
