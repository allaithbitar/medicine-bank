import { useCallback, useMemo } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Card, Divider, Stack, Button, Grid } from "@mui/material";
import Add from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DifferenceIcon from "@mui/icons-material/Difference";
import STRINGS from "@/core/constants/strings.constant";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import ErrorCard from "@/core/components/common/error-card/error-card.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";

import { useDisclosureLoader } from "../hooks/disclosure-loader.hook";
import { Edit } from "@mui/icons-material";
import DisclosureHeaderCard from "../components/disclosure-header-card";
import DisclosureTabs from "../components/disclosure-tabs";
import DisclosureDetailsSection from "../components/disclosure-details-section";
import DisclosureNotesTab from "../components/tabs/disclosure-notes-tab";
import DisclosureAppointmentTab from "../components/tabs/disclosure-appointment-tab";
import DisclosureMedicinesTab from "../components/tabs/disclosure-medicines-tab";
import DisclosureFamilyMembersTab from "../components/tabs/disclosure-family-members-tab";
import DisclosureVisitAndRatingSection from "../components/disclosure-visit-and-rating-section";

const DisclosurePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabIndex = Number(searchParams.get("tab") ?? 0);

  const { disclosureId } = useParams<{ disclosureId: string }>();
  const navigate = useNavigate();

  const {
    data: disclosure,
    isLoading,
    error,
  } = useDisclosureLoader({ id: disclosureId });

  const openEditExtra = useCallback(
    (section: "appointment" | "rating" | "visit" | "visit-rating") =>
      navigate(`/disclosures/${section}/action`, { state: disclosure }),
    [navigate, disclosure]
  );

  const openAudit = useCallback(
    () => navigate(`/disclosures/${disclosure?.id}/audit`),
    [navigate, disclosure?.id]
  );

  const openEditDetails = useCallback(
    () =>
      navigate(`/disclosures/details/action?disclosureId=${disclosure?.id}`),
    [navigate, disclosure?.id]
  );

  const openNoteAction = useCallback(
    () => navigate(`/disclosures/${disclosureId}/note/action`),
    [navigate, disclosureId]
  );

  const handleOpenBeneficiaryMedicineActionPage = useCallback(
    (bm?: any) =>
      navigate(`/beneficiaries/${disclosure?.patientId}/medicine/action`, {
        state: { oldBeneficiaryMedicine: bm },
      }),
    [navigate, disclosure?.patientId]
  );

  const handleOpenFamilyMembersActionPage = useCallback(
    (oldMember?: any) =>
      navigate(`/beneficiaries/${disclosure?.patientId}/family/action`, {
        state: { oldMember },
      }),
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
    }),
    [
      disclosureId,
      disclosure,
      openEditExtra,
      handleOpenBeneficiaryMedicineActionPage,
      handleOpenFamilyMembersActionPage,
      openNoteAction,
    ]
  );
  if (error) return <ErrorCard error={error} />;
  if (isLoading || !disclosure) return <PageLoading />;

  return (
    <>
      <Stack gap={3}>
        <Card>
          <Stack gap={1} sx={{ p: 0 }}>
            <DisclosureHeaderCard disclosure={disclosure} />
            <Divider />
            <DisclosureDetailsSection details={disclosure.details} />
            <DisclosureVisitAndRatingSection disclosure={disclosure} />
            <Divider />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Link to={`/disclosures/action?disclosureId=${disclosure.id}`}>
                  <Button fullWidth startIcon={<Edit />}>
                    {STRINGS.edit} {STRINGS.disclosure}
                  </Button>
                </Link>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  startIcon={<DifferenceIcon />}
                  onClick={openAudit}
                >
                  {STRINGS.audit_log}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  startIcon={<ListAltIcon />}
                  onClick={openEditDetails}
                >
                  {STRINGS.edit} {STRINGS.disclosures_details}
                </Button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  onClick={() => openEditExtra && openEditExtra("visit-rating")}
                  startIcon={<Edit />}
                >
                  {`${STRINGS.edit} ${STRINGS.visit} ${STRINGS.and} ${STRINGS.rating}`}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Card>

        <Card>
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
                label: STRINGS.notes,
                node: <DisclosureNotesTab {...tabProps} />,
              },
              {
                label: STRINGS.appointment,
                node: <DisclosureAppointmentTab {...tabProps} />,
              },
              {
                label: STRINGS.medicines,
                node: <DisclosureMedicinesTab {...tabProps} />,
              },
              {
                label: STRINGS.family_members,
                node: <DisclosureFamilyMembersTab {...tabProps} />,
              },
            ]}
          />
        </Card>
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
        ]}
      />
    </>
  );
};

export default DisclosurePage;
