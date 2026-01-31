import { Stack, Button, Card, Typography, Chip } from '@mui/material';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import BeneficiaryCommonCard from '@/shared/components/beneficiary-common-card';
import Header from '@/core/components/common/header/header';
import STRINGS from '@/core/constants/strings.constant';
import { formatDateTime, isNullOrUndefined } from '@/core/helpers/helpers';
import type { TDisclosure } from '../types/disclosure.types';
import {
  Comment,
  DirectionsWalk,
  Edit,
  EventAvailable,
  History,
  Info,
  InfoOutline,
  Archive,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getDisclosureLateDaysCount } from '../helpers/disclosure.helpers';
import usePermissions from '@/core/hooks/use-permissions.hook';

const DisclosureHeaderCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const { isLate, lateDaysCount } = useMemo(() => getDisclosureLateDaysCount(disclosure), [disclosure]);
  const { canEdit, currentCanEdit } = usePermissions();
  const canUserEditPatient = canEdit('/beneficiaries/action');
  const isArchived = disclosure.status === 'archived';

  return (
    <>
      <Card>
        <Header title={STRINGS.patient} />
        <BeneficiaryCommonCard canEditPatient={canUserEditPatient} isDisclosurePage beneficiary={disclosure.patient} />
      </Card>
      <Card>
        <Header title={STRINGS.disclosure} />
        <Stack gap={2}>
          {isArchived && (
            <Chip
              icon={<Archive />}
              label={STRINGS.archived}
              color="warning"
              size="medium"
              sx={{
                alignSelf: 'flex-start',
              }}
            />
          )}
          <DetailItem icon={<InfoOutline />} label={STRINGS.status} value={STRINGS[disclosure.status]} />
          <DetailItem
            icon={<DirectionsWalk />}
            label={STRINGS.disclosure_scout}
            value={disclosure.scout?.name ?? STRINGS.none}
          />

          <DetailItem
            icon={<Info />}
            label={STRINGS.priority_degree}
            value={
              <Stack direction="row" alignItems="center" gap={1}>
                <Typography variant="subtitle2">{disclosure.priority.name}</Typography>
                {isLate && (
                  <Chip
                    size="small"
                    color="error"
                    label={`${STRINGS.disclosure_is_late} ( ${lateDaysCount} ${STRINGS.day} )`}
                    sx={{
                      zIndex: 1,
                    }}
                  />
                )}
              </Stack>
            }
          />
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.disclosure_created_at}
            value={`${formatDateTime(disclosure.createdAt)} ${isNullOrUndefined(disclosure.createdBy?.name) ? '' : `${STRINGS.by} ${disclosure.createdBy?.name}`}`}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.disclosure_updated_at}
            value={
              !disclosure.updatedAt
                ? STRINGS.none
                : `${formatDateTime(disclosure.updatedAt)} ${isNullOrUndefined(disclosure.updatedBy?.name) ? '' : `${STRINGS.by} ${disclosure.updatedBy?.name}`}`
            }
          />
          <DetailItem icon={<Comment />} label={STRINGS.initial_note} value={disclosure.initialNote || STRINGS.none} />
          {currentCanEdit && (
            <Link to={`/disclosures/action?disclosureId=${disclosure.id}`}>
              <Button fullWidth startIcon={<Edit />}>
                {STRINGS.edit} {STRINGS.disclosure}
              </Button>
            </Link>
          )}
        </Stack>
      </Card>
    </>
  );
};

export default DisclosureHeaderCard;
