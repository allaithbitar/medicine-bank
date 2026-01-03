import { useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save } from '@mui/icons-material';
import disclosuresApi from '../api/disclosures.api';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import type {
  TDisclosure,
  TDisclosureRating,
  TUpdateDisclosureVisitAndRatingDto,
  TVisit,
} from '../types/disclosure.types';

import { Stack } from '@mui/material';
import DisclosureVisitAndRateActionForm, {
  type TDisclosureVisitAndRateFormHandlers,
} from '../components/disclosure-visit-and-rate-action-form.component';

const DisclosureVisitAndRatingActionPage = () => {
  const { state } = useLocation();
  const disclosure: TDisclosure = state;
  const visitAndRateRef = useRef<TDisclosureVisitAndRateFormHandlers | null>(null);

  const navigate = useNavigate();

  const [updateDisclosureRating, { isLoading }] = disclosuresApi.useUpdateDisclosureMutation();

  const handleSave = async () => {
    const { isValid, result } = await visitAndRateRef.current!.handleSubmit();

    if (!isValid || !disclosure.id) return;

    try {
      const updateDto: TUpdateDisclosureVisitAndRatingDto = {
        id: disclosure.id,
        customRating: result.customRating || null,
        isCustomRating: result.isCustomRating,
        ratingId: result.rating?.id || null,
        ratingNote: result.ratingNote || null,
        visitNote: result.visitNote || null,
        visitReason: result.visitReason || null,
        visitResult: result.visitResult?.id || null,
      };

      if (updateDto.ratingId || updateDto.customRating) {
        updateDto.visitNote = null;
        updateDto.visitReason = null;
      } else {
        updateDto.ratingId = null;
        updateDto.ratingNote = null;
        updateDto.isCustomRating = false;
        updateDto.customRating = null;
      }

      const { error } = await updateDisclosureRating(updateDto);

      if (error) {
        notifyError(error);
      } else {
        navigate(-1);
        notifySuccess(STRINGS.edited_successfully);
      }
    } catch (error: any) {
      notifyError(error);
    }
  };

  const disclosureVisitRateData = {
    visitNote: disclosure?.visitNote,
    visitReason: disclosure?.visitReason,
    visitResult: disclosure?.visitResult ?? 'not_completed',
    isCustom: disclosure?.isCustomRating,
    customRating: disclosure?.customRating,
    ratingId: disclosure?.rating?.id,
    rating: disclosure?.rating,
    ratingNote: disclosure?.ratingNote,
  } as unknown as TDisclosureRating & TVisit;

  return (
    <Stack>
      <DisclosureVisitAndRateActionForm
        ref={visitAndRateRef}
        disclosureVisitRateData={disclosureVisitRateData}
        disclosureId={disclosure.id}
      />
      <ActionFab color="success" icon={<Save />} disabled={isLoading} onClick={handleSave} />
      {isLoading && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureVisitAndRatingActionPage;
