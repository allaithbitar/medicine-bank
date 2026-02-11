import { useState, useEffect, useMemo } from 'react';
import { Button, Stack, Alert } from '@mui/material';
import { Close, SwapHoriz } from '@mui/icons-material';
import ModalWrapper from '@/core/components/common/modal/modal-wrapper.component';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import STRINGS from '@/core/constants/strings.constant';
import EmployeesAutocomplete from '@/features/employees/components/employees-autocomplete.component';
import AreasAutocomplete from '@/features/banks/components/work-areas/work-area-autocomplete/work-area-autocomplete.component';
import type { TAutocompleteItem } from '@/core/types/common.types';
import employeesApi from '@/features/employees/api/employees.api';

interface IMoveDisclosuresModalProps {
  onConfirm: (data: { fromScoutId: string; toScoutId: string; areaIds?: string[] }) => void;
}

const MoveDisclosuresModal = ({ onConfirm }: IMoveDisclosuresModalProps) => {
  const { closeModal } = useModal();
  const [fromScout, setFromScout] = useState<TAutocompleteItem | null>(null);
  const [toScout, setToScout] = useState<TAutocompleteItem | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<TAutocompleteItem[]>([]);
  const [fromScoutCityId, setFromScoutCityId] = useState<string | undefined>(undefined);
  const { data: fromScoutData } = employeesApi.useGetEmployeeQuery(
    { id: fromScout?.id ?? '' },
    { skip: !fromScout?.id }
  );

  useEffect(() => {
    setSelectedAreas([]);
    if (fromScoutData?.areas && fromScoutData.areas.length > 0) {
      const firstCityId = fromScoutData.areas[0]?.area?.cityId;
      setFromScoutCityId(firstCityId);
    } else {
      setFromScoutCityId(undefined);
    }
  }, [fromScoutData]);

  const handleMove = () => {
    if (!fromScout || !toScout) return;
    onConfirm({
      fromScoutId: fromScout.id,
      toScoutId: toScout.id,
      areaIds: selectedAreas.length > 0 ? selectedAreas.map((a) => a.id) : undefined,
    });
  };

  const isValid = fromScout && toScout && fromScout.id !== toScout.id;
  const isSameScout = fromScout && toScout && fromScout.id === toScout.id;
  const areaOptions: TAutocompleteItem[] = useMemo(
    () =>
      fromScoutData?.areas.map((a) => ({
        id: a.area.id,
        name: a.area.name,
      })) ?? [],
    [fromScoutData?.areas]
  );

  return (
    <ModalWrapper
      title={STRINGS.move_disclosures_title}
      actionButtons={
        <Stack direction="row" gap={1} sx={{ width: '100%' }}>
          <Button fullWidth variant="outlined" startIcon={<Close />} onClick={() => closeModal()}>
            {STRINGS.cancel}
          </Button>
          <Button fullWidth startIcon={<SwapHoriz />} onClick={handleMove} disabled={!isValid}>
            {STRINGS.move_disclosures}
          </Button>
        </Stack>
      }
    >
      <Stack gap={2}>
        <EmployeesAutocomplete
          required
          roles={['scout']}
          label={STRINGS.from_scout}
          multiple={false}
          value={fromScout}
          onChange={(v) => setFromScout(v)}
        />
        <EmployeesAutocomplete
          required
          roles={['scout']}
          label={STRINGS.to_scout}
          multiple={false}
          value={toScout}
          onChange={(v) => setToScout(v)}
        />
        {isSameScout && (
          <Alert severity="error" sx={{ fontSize: 15, alignItems: 'center' }}>
            {STRINGS.cannot_select_same_scout}
          </Alert>
        )}
        <>
          <AreasAutocomplete
            multiple
            disabled={!fromScout && !!isSameScout}
            label={STRINGS.select_areas_optional}
            value={selectedAreas}
            options={areaOptions}
            onChange={(v) => setSelectedAreas(v)}
            cityId={fromScoutCityId}
          />
          <Alert severity="info" sx={{ fontSize: 15, alignItems: 'center' }}>
            {STRINGS.move_all_areas_note}
          </Alert>
        </>
      </Stack>
    </ModalWrapper>
  );
};

export default MoveDisclosuresModal;
