import { Stack, Typography } from "@mui/material";
import disclosuresApi from "../api/disclosures.api";
import type { TDisclosureVisit } from "../types/disclosure.types";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import { deepPurple } from "@mui/material/colors";
import STRINGS from "@/core/constants/strings.constant";
import { formatDateTime } from "@/core/helpers/helpers";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import { Comment, EventAvailable, History } from "@mui/icons-material";
import Nodata from "@/core/components/common/no-data/no-data.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";

const VisitCard = ({ visit }: { visit: TDisclosureVisit }) => {
  return (
    <ReusableCardComponent
      headerContent={
        <Typography color="white">{STRINGS[visit.result]}</Typography>
      }
      headerBackground={`linear-gradient(to right, ${deepPurple[800]}, ${deepPurple[500]})`}
      bodyContent={
        <Stack gap={2}>
          <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={formatDateTime(visit.createdAt)}
          />

          <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              !visit.updatedAt || visit.updatedAt === visit.createdAt
                ? STRINGS.none
                : formatDateTime(visit.updatedAt)
            }
          />
          <DetailItem
            icon={<Comment />}
            label={STRINGS.note}
            value={visit.note || STRINGS.none}
          />
        </Stack>
      }
      footerContent={null}
    />
  );
};

const DisclosureVisists = ({ disclosureId }: { disclosureId?: string }) => {
  const { data: { items: ratings } = { items: [] }, isFetching } =
    disclosuresApi.useGetDisclosureVisitsQuery(
      { disclosureId: disclosureId! },
      { skip: !disclosureId },
    );

  return (
    <Stack gap={2}>
      {ratings.map((v) => (
        <VisitCard key={v.id} visit={v} />
      ))}
      {!isFetching && !ratings.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureVisists;
