import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button, Card, Stack, Tab, Tabs } from "@mui/material";
import STRINGS from "@/core/constants/strings.constant";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import {
  Add,
  DirectionsWalk,
  Edit,
  EmojiPeople,
  EventAvailable,
  History,
  InfoOutline,
  Comment,
} from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import PageLoading from "@/core/components/common/page-loading/page-loading.component";
import DisclosureRatings from "../components/disclosure-ratings.component";
import DisclosureVisists from "../components/disclosure-visits.component";
import ActionsFab from "@/core/components/common/actions-fab/actions-fab.component";
import { useDisclosureLoader } from "../hooks/disclosure-loader.hook";
import ErrorCard from "@/core/components/common/error-card/error-card.component";

const DisclosurePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = Number(searchParams.get("tab") ?? 0);

  const navigate = useNavigate();

  const { disclosureId } = useParams();

  const {
    data: disclosure,
    isLoading,
    error,
  } = useDisclosureLoader({ id: disclosureId });

  if (error) {
    return <ErrorCard error={error} />;
  }

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
            value={disclosure.scout?.name ?? STRINGS.none}
          />

          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={`${formatDateTime(disclosure.createdAt)} ${STRINGS.by} ${disclosure.createdBy?.name}`}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              !disclosure.updatedAt ||
              disclosure.createdAt === disclosure.updatedAt
                ? STRINGS.none
                : `${formatDateTime(disclosure.updatedAt)} ${STRINGS.by} ${disclosure.updatedBy?.name}`
            }
          />

          <DetailItem
            icon={<Comment />}
            label={STRINGS.note}
            value={disclosure.note || STRINGS.none}
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
      <ActionsFab
        actions={[
          {
            icon: <Add />,
            label: STRINGS.add_visit,
            onClick: () =>
              navigate(`/disclosures/${disclosureId}/visit/action`),
          },
          {
            icon: <Add />,
            label: STRINGS.add_rating,
            onClick: () =>
              navigate(`/disclosures/${disclosureId}/rating/action`),
          },
        ]}
      />
    </Stack>
  );
};

export default DisclosurePage;
