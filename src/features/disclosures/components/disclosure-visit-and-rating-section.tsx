import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import { Edit } from '@mui/icons-material';
import { Stack, Divider, Typography, Card, Button } from '@mui/material';
import type { TDisclosure } from '../types/disclosure.types';
import CustomBadge from './custom-badge.component';
import { Link } from 'react-router-dom';
import usePermissions from '@/core/hooks/use-permissions.hook';

function DisclosureVisitAndRatingSection({ disclosure }: { disclosure: TDisclosure }) {
  const { currentCanEdit } = usePermissions();
  return (
    <Card>
      <Stack gap={1.5} alignItems="start">
        <Header title={`${STRINGS.visit} ${STRINGS.and} ${STRINGS.rating}`} />
        <Stack sx={{ width: '100%' }} gap={1}>
          <Card sx={{ px: 2, py: 0.5 }}>
            <Typography textAlign="center">{STRINGS.visit}</Typography>
          </Card>
          {disclosure.visitResult ? (
            <>
              <CustomBadge
                textAlign="center"
                colors={
                  disclosure.visitResult === 'completed'
                    ? 'success'
                    : disclosure.visitResult === 'not_completed'
                      ? 'warning'
                      : 'error'
                }
              >
                {STRINGS[disclosure.visitResult]}
                {disclosure.visitResult === 'not_completed' && ` (${STRINGS.hg})`}
                {disclosure.visitResult === 'cant_be_completed' && ` (${STRINGS.hg_plus})`}
              </CustomBadge>
              {disclosure.visitReason && (
                <>
                  <Card sx={{ px: 2, py: 0.5 }}>
                    <Typography textAlign="center">{STRINGS.visit_reason}</Typography>
                  </Card>
                  <Typography variant="subtitle2">{disclosure.visitReason}</Typography>
                </>
              )}
              {disclosure.visitNote && (
                <>
                  <Card sx={{ px: 2, py: 0.5 }}>
                    <Typography textAlign="center">{STRINGS.note}</Typography>
                  </Card>
                  <Typography variant="subtitle2" color="textSecondary">
                    {disclosure.visitNote}
                  </Typography>
                </>
              )}
            </>
          ) : (
            <>
              <CustomBadge textAlign="center" colors="grey">
                {STRINGS.hasnt_been_visited_yet}
              </CustomBadge>
            </>
          )}
        </Stack>
        <Divider flexItem />
        <Stack sx={{ width: '100%' }} gap={1.5}>
          <Card sx={{ px: 2, py: 0.5 }}>
            <Typography textAlign="center">{STRINGS.rating}</Typography>
          </Card>

          {!disclosure.ratingId && !disclosure.isCustomRating && !disclosure.customRating ? (
            <>
              <CustomBadge textAlign="center" colors="grey">
                {STRINGS.hasnt_been_rated_yet}
              </CustomBadge>
            </>
          ) : (
            <>
              <CustomBadge textAlign="center" colors="info">
                {(disclosure.rating?.name && `${disclosure.rating.name} - (${disclosure.rating.code})`) ||
                  (disclosure.isCustomRating && STRINGS.custom_rating)}
              </CustomBadge>
              {disclosure.isCustomRating && (
                <>
                  <Typography>{disclosure.customRating}</Typography>
                </>
              )}
              {disclosure.ratingNote && (
                <>
                  <Card sx={{ px: 2, py: 0.5 }}>
                    <Typography textAlign="center">{STRINGS.note}</Typography>
                  </Card>

                  <Typography variant="subtitle2" color="textSecondary">
                    {disclosure.ratingNote}
                  </Typography>
                </>
              )}
            </>
          )}
        </Stack>
        <Divider flexItem />
        {currentCanEdit && (
          <Link style={{ width: '100%' }} to={`/disclosures/visit-rating/action?id=${disclosure.id}`}>
            <Button fullWidth startIcon={<Edit />}>
              {`${STRINGS.edit} ${STRINGS.visit} ${STRINGS.and} ${STRINGS.rating}`}
            </Button>
          </Link>
        )}
      </Stack>
    </Card>
  );
}

export default DisclosureVisitAndRatingSection;
