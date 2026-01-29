import { useRef } from 'react';
import ModalWrapper from '../../../core/components/common/modal/modal-wrapper.component';
import BeneficiariesFilters, { type TBeneficiariesFiltersHandlers } from './beneficiaries-filters.component';
import { Button, Stack } from '@mui/material';
import { Close, FilterAltOff, Search } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import type { TBeneficiaryFiltersForm } from '../helpers/beneficiary.helpers';

const BeneficiariesFiltersModal = ({
  onSubmit,
  values,
}: {
  values?: TBeneficiaryFiltersForm;
  onSubmit: (values: TBeneficiaryFiltersForm) => void;
}) => {
  const { closeModal } = useModal();

  const ref = useRef<TBeneficiariesFiltersHandlers>(null);

  return (
    <ModalWrapper
      actionButtons={
        <Stack direction="row" gap={2} width="100%">
          <Button fullWidth variant="outlined" startIcon={<Close />} onClick={() => closeModal()}>
            {STRINGS.close}
          </Button>

          <Button fullWidth variant="outlined" startIcon={<FilterAltOff />} onClick={() => ref.current!.reset()}>
            {STRINGS.clear}
          </Button>

          <Button fullWidth startIcon={<Search />} onClick={() => onSubmit(ref.current!.getValues())}>
            {STRINGS.search}
          </Button>
        </Stack>
      }
    >
      <BeneficiariesFilters values={values} ref={ref} />
    </ModalWrapper>
  );
};

export default BeneficiariesFiltersModal;
