import ModalWrapper from '@/core/components/common/modal/modal-wrapper.component';
import DisclosureFilters, { type TDisclosureFiltesHandlers } from './disclosure-filters.component';
import { useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { Close, FilterAltOff, Search } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import type { TGetDisclosuresDto } from '../types/disclosure.types';

const DisclosureFiltersModal = ({
  onSubmit,
}: {
  onSubmit: (values: Omit<TGetDisclosuresDto, 'pageSize' | 'pageNumber'>) => void;
}) => {
  const { closeModal } = useModal();
  const formRef = useRef<TDisclosureFiltesHandlers>(null);
  return (
    <ModalWrapper
      actionButtons={
        <Stack direction="row" gap={2}>
          <Button variant="outlined" startIcon={<Close />} onClick={() => closeModal()}>
            {STRINGS.close}
          </Button>

          <Button variant="outlined" startIcon={<FilterAltOff />} onClick={() => formRef.current!.reset()}>
            {STRINGS.clear}
          </Button>

          <Button startIcon={<Search />} onClick={() => onSubmit(formRef.current!.getValues())}>
            {STRINGS.search}
          </Button>
        </Stack>
      }
    >
      <DisclosureFilters ref={formRef} />
    </ModalWrapper>
  );
};

export default DisclosureFiltersModal;
