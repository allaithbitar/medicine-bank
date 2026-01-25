import ModalWrapper from '@/core/components/common/modal/modal-wrapper.component';
import DisclosureFilters, {
  type TDisclosureFiltersForm,
  type TDisclosureFiltesHandlers,
} from './disclosure-filters.component';
import { useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { Close, FilterAltOff, Search } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';

const DisclosureFiltersModal = ({
  onSubmit,
  value,
}: {
  value: TDisclosureFiltersForm;
  onSubmit: (values: TDisclosureFiltersForm) => void;
}) => {
  const { closeModal } = useModal();
  const formRef = useRef<TDisclosureFiltesHandlers>(null);
  return (
    <ModalWrapper
      actionButtons={
        <Stack direction="row" gap={1} sx={{ width: '100%' }}>
          <Button fullWidth variant="outlined" startIcon={<Close />} onClick={() => closeModal()}>
            {STRINGS.close}
          </Button>

          <Button fullWidth variant="outlined" startIcon={<FilterAltOff />} onClick={() => formRef.current!.reset()}>
            {STRINGS.clear}
          </Button>

          <Button fullWidth startIcon={<Search />} onClick={() => onSubmit(formRef.current!.getValues())}>
            {STRINGS.search}
          </Button>
        </Stack>
      }
    >
      <DisclosureFilters value={value} ref={formRef} />
    </ModalWrapper>
  );
};

export default DisclosureFiltersModal;
