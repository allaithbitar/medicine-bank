import { Button, Stack, Typography } from "@mui/material";
import type { TDisclosureVisit } from "../types/disclosure.types";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import { deepPurple } from "@mui/material/colors";
import STRINGS from "@/core/constants/strings.constant";
import { formatDateTime } from "@/core/helpers/helpers";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import {
  Comment,
  Edit,
  EventAvailable,
  HelpOutlined,
  History,
} from "@mui/icons-material";
import Nodata from "@/core/components/common/no-data/no-data.component";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import { Link } from "react-router-dom";
import { useVisitsLoader } from "../hooks/visits-loader.hook";
import { DEFAULT_PAGE_SIZE } from "@/core/constants/properties.constant";

const VisitCard = ({ visit }: { visit: TDisclosureVisit }) => {
  return (
    <ReusableCardComponent
      headerContent={
        <Typography color="white">{STRINGS[visit.result]}</Typography>
      }
      headerBackground={`linear-gradient(to right, ${deepPurple[800]}, ${deepPurple[500]})`}
      bodyContent={
        <Stack gap={2}>
          {visit.result !== "completed" && (
            <DetailItem
              icon={<HelpOutlined />}
              label={STRINGS.visit_reason}
              value={visit.reason ?? ""}
            />
          )}
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
      footerContent={
        <Link
          style={{ alignSelf: "end" }}
          to={`/disclosures/${visit.disclosureId}/visit/action?visitId=${visit.id}`}
        >
          <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
        </Link>
      }
    />
  );
};

const DisclosureVisists = ({ disclosureId }: { disclosureId?: string }) => {
  const { items, isFetching } = useVisitsLoader({
    disclosureId: disclosureId!,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <Stack gap={2}>
      {items.map((v) => (
        <VisitCard key={v.id} visit={v} />
      ))}
      {!isFetching && !items.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureVisists;
