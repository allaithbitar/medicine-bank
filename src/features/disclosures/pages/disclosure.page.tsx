import { useCallback, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import Add from '@mui/icons-material/Add';
import DifferenceIcon from '@mui/icons-material/Difference';
import STRINGS from '@/core/constants/strings.constant';
import PageLoading from '@/core/components/common/page-loading/page-loading.component';
import ErrorCard from '@/core/components/common/error-card/error-card.component';
import ActionsFab from '@/core/components/common/actions-fab/actions-fab.component';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

import { useDisclosureLoader } from '../hooks/disclosure-loader.hook';
import DisclosureHeaderCard from '../components/disclosure-header-card';
import DisclosureTabs from '../components/disclosure-tabs';
import DisclosureDetailsSection from '../components/disclosure-details-section';
import DisclosureNotesTab from '../components/tabs/disclosure-notes-tab';
import DisclosureMedicinesTab from '../components/tabs/disclosure-medicines-tab';
import DisclosureFamilyMembersTab from '../components/tabs/disclosure-family-members-tab';
import DisclosureVisitAndRatingSection from '../components/disclosure-visit-and-rating-section';
import DisclosureProperties from './disclosure-properties.component';
import type { TBeneficiaryMedicine, TFamilyMember } from '@/features/beneficiaries/types/beneficiary.types';

const DisclosurePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabIndex = Number(searchParams.get('tab') ?? 0);

  const { disclosureId } = useParams<{ disclosureId: string }>();
  const navigate = useNavigate();

  const { data: disclosure, isLoading, error } = useDisclosureLoader({ id: disclosureId ?? '' });

  const openEditExtra = useCallback(
    (section: 'appointment' | 'rating' | 'visit' | 'visit-rating') =>
      navigate(`/disclosures/${section}/action?id=${disclosure?.id}`),
    [navigate, disclosure]
  );

  const openAudit = useCallback(() => navigate(`/disclosures/${disclosure?.id}/audit`), [navigate, disclosure?.id]);

  const openEditDetails = useCallback(
    () => navigate(`/disclosures/details/action?disclosureId=${disclosure?.id}`),
    [navigate, disclosure?.id]
  );

  const openNoteAction = useCallback(
    () => navigate(`/disclosures/${disclosureId}/note/action`),
    [navigate, disclosureId]
  );

  const handleOpenBeneficiaryMedicineActionPage = useCallback(
    (bm?: TBeneficiaryMedicine) => {
      if (bm) {
        navigate(`/beneficiaries/${disclosure?.patientId}/medicine/action?id=${bm.id}`);
      } else {
        navigate(`/beneficiaries/${disclosure?.patientId}/medicine/action`);
      }
    },
    [navigate, disclosure?.patientId]
  );

  const handleOpenFamilyMembersActionPage = useCallback(
    (oldMember?: TFamilyMember) => {
      if (oldMember) {
        navigate(`/beneficiaries/${disclosure?.patientId}/family/action?id=${oldMember.id}`);
      } else {
        navigate(`/beneficiaries/${disclosure?.patientId}/family/action`);
      }
    },
    [navigate, disclosure?.patientId]
  );

  const tabProps = useMemo(
    () => ({
      disclosureId,
      disclosure,
      openEditExtra,
      handleOpenBeneficiaryMedicineActionPage,
      handleOpenFamilyMembersActionPage,
      openNoteAction,
      openEditDetails,
    }),
    [
      disclosureId,
      disclosure,
      openEditExtra,
      handleOpenBeneficiaryMedicineActionPage,
      handleOpenFamilyMembersActionPage,
      openNoteAction,
      openEditDetails,
    ]
  );
  if (error) return <ErrorCard error={error} />;

  if (isLoading || !disclosure) return <PageLoading />;

  return (
    <>
      <Stack gap={1}>
        <DisclosureHeaderCard disclosure={disclosure} />
        <DisclosureVisitAndRatingSection disclosure={disclosure} />

        <DisclosureProperties disclosure={disclosure} />

        <DisclosureTabs
          value={tabIndex}
          onChange={(newTab) =>
            setSearchParams(
              {
                ...Object.fromEntries(searchParams.entries()),
                tab: String(newTab),
              },
              { replace: true }
            )
          }
          tabs={[
            {
              label: STRINGS.family_members,
              node: <DisclosureFamilyMembersTab {...tabProps} />,
            },
            {
              label: STRINGS.disclosures_details,
              node: <DisclosureDetailsSection {...tabProps} />,
            },
            {
              label: STRINGS.medicines,
              node: <DisclosureMedicinesTab {...tabProps} />,
            },
            {
              label: STRINGS.notes,
              node: <DisclosureNotesTab {...tabProps} />,
            },
          ]}
        />
      </Stack>

      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.add_disclosure_note,
            onClick: () => navigate(`/disclosures/${disclosureId}/note/action`),
          },
          {
            icon: <Add />,
            label: STRINGS.add_medicine,
            onClick: () => handleOpenBeneficiaryMedicineActionPage(undefined),
          },
          {
            icon: <Add />,
            label: STRINGS.add_family_member,
            onClick: () => handleOpenFamilyMembersActionPage(undefined),
          },
          {
            icon: <DifferenceIcon />,
            label: STRINGS.audit_log,
            onClick: () => openAudit(),
          },
          {
            icon: <PsychologyAltIcon />,
            label: STRINGS.consulting_adviser,
            onClick: () => navigate(`/disclosures/${disclosureId}/consulting_adviser`),
          },
        ]}
      />
    </>
  );
};

export default DisclosurePage;
