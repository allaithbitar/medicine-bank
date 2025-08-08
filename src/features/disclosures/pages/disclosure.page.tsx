import { Link, useParams, useSearchParams } from "react-router-dom";
import disclosuresApi from "../api/disclosures.api";
import { Button, Card, Stack, Tab, Tabs } from "@mui/material";
import STRINGS from "@/core/constants/strings.constant";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import {
  DirectionsWalk,
  Edit,
  EmojiPeople,
  EventAvailable,
  History,
  InfoOutline,
} from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import DisclosureRatings from "../components/disclosure-ratings.component";
import DisclosureVisists from "../components/disclosure-visits.component";

const DisclosurePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = Number(searchParams.get("tab") ?? 0);

  const { disclosureId } = useParams();
  const { data: disclosure, isLoading } = disclosuresApi.useGetDisclosureQuery(
    { id: disclosureId! },
    { skip: !disclosureId },
  );

  if (isLoading || !disclosure) return <PageLoading />;

  return (
    <Stack gap={3}>
      <Card>
        <Stack gap={2}>
          <DetailItem
            icon={<InfoOutline />}
            label={STRINGS.status}
            // iconColorPreset="green"
            value={STRINGS[disclosure.status]}
          />

          <DetailItem
            icon={<EmojiPeople />}
            label={STRINGS.beneficiary}
            // iconColorPreset="green"
            value={disclosure.patient?.name ?? STRINGS.none}
          />

          <DetailItem
            icon={<DirectionsWalk />}
            label={STRINGS.disclosure_scout}
            // iconColorPreset="green"
            value={disclosure.employee?.name ?? STRINGS.none}
          />

          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(disclosure.createdAt)}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              disclosure.updatedAt
                ? formatDateTime(disclosure.updatedAt)
                : STRINGS.none
            }
          />

          <Link
            to={`/disclosures/action?disclosureId=${disclosure.id}`}
            style={{ alignSelf: "end" }}
          >
            <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
          </Link>
        </Stack>
      </Card>
      <Card sx={{ p: 1 }}>
        <Tabs
          variant="fullWidth"
          value={currentTab}
          onChange={(_, v) =>
            setSearchParams((prev) => ({ ...prev, tab: v }), { replace: true })
          }
          slotProps={{
            indicator: {
              sx: {
                height: "15%",
                borderRadius: 10,
              },
            },
          }}
        >
          <Tab label={STRINGS.ratings} />
          <Tab label={STRINGS.visits} />
        </Tabs>
      </Card>
      {currentTab === 0 && <DisclosureRatings disclosureId={disclosureId} />}
      {currentTab === 1 && <DisclosureVisists disclosureId={disclosureId} />}
    </Stack>
  );
};

export default DisclosurePage;
