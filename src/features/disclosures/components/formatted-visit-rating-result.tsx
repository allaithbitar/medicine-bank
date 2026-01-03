import { useMemo } from 'react';
import CustomBadge from './custom-badge.component';
import STRINGS from '@/core/constants/strings.constant';
import type { TDisclosure } from '../types/disclosure.types';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import { HelpOutlined } from '@mui/icons-material';

function FormattedVisitRatingResult({ disclosure }: { disclosure: TDisclosure }) {
  const FormattedVisitResult = ({ disclosure }: { disclosure: TDisclosure }) => {
    const colors = useMemo(() => {
      switch (disclosure.visitResult) {
        case 'not_completed': {
          return 'warning';
        }
        case 'cant_be_completed': {
          return 'error';
        }
        case 'completed': {
          return 'success';
        }
        default: {
          return 'grey';
        }
      }
    }, [disclosure.visitResult]);

    return (
      <CustomBadge colors={colors}>
        {disclosure.visitResult ? STRINGS[disclosure.visitResult] : STRINGS.hasnt_been_visited_yet}
      </CustomBadge>
    );
  };

  const FormattedRatingResult = ({ disclosure }: { disclosure: TDisclosure }) => {
    const colors = useMemo(() => {
      if (!disclosure.ratingId && !disclosure.isCustomRating && !disclosure.customRating) {
        return 'grey';
      }
      return 'info';
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disclosure.visitResult]);

    return (
      <CustomBadge colors={colors}>
        {disclosure.rating?.name ||
          (disclosure.isCustomRating && STRINGS.custom_rating) ||
          STRINGS.hasnt_been_rated_yet}
      </CustomBadge>
    );
  };

  return (
    <>
      <DetailItemComponent
        icon={<HelpOutlined />}
        label={`${STRINGS.last_visit_result} `}
        value={<FormattedVisitResult disclosure={disclosure} />}
      />
      <DetailItemComponent
        icon={<HelpOutlined />}
        label={`${STRINGS.last_rating_result} `}
        value={<FormattedRatingResult disclosure={disclosure} />}
      />
    </>
  );
}

export default FormattedVisitRatingResult;
