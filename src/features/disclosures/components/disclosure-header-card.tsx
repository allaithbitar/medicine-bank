import { Stack, Divider } from "@mui/material";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import BeneficiaryCommonCard from "@/shared/components/beneficiary-common-card";
import Header from "@/core/components/common/header/header";
import STRINGS from "@/core/constants/strings.constant";
import { formatDateTime, isNullOrUndefined } from "@/core/helpers/helpers";
import type { TDisclosure } from "../types/disclosure.types";
import {
  Comment,
  DirectionsWalk,
  EventAvailable,
  History,
  InfoOutline,
} from "@mui/icons-material";

const DisclosureHeaderCard = ({ disclosure }: { disclosure: TDisclosure }) => (
  <Stack sx={{ gap: 1, p: 2 }}>
    <Header title={STRINGS.patient} />
    <BeneficiaryCommonCard beneficiary={disclosure.patient} />
    <Divider />
    <Header title={STRINGS.disclosure} />
    <Stack gap={2}>
      <DetailItem
        icon={<InfoOutline />}
        label={STRINGS.status}
        value={STRINGS[disclosure.status]}
      />
      <DetailItem
        icon={<DirectionsWalk />}
        label={STRINGS.disclosure_scout}
        value={disclosure.scout?.name ?? STRINGS.none}
      />
      <DetailItem
        icon={<EventAvailable />}
        label={STRINGS.disclosure_created_at}
        value={`${formatDateTime(disclosure.createdAt)} ${
          isNullOrUndefined(disclosure.createdBy?.name)
            ? ""
            : `${STRINGS.by} ${disclosure.createdBy?.name}`
        }`}
      />
      <DetailItem
        icon={<History />}
        label={STRINGS.disclosure_updated_at}
        value={
          !disclosure.updatedAt || disclosure.createdAt === disclosure.updatedAt
            ? STRINGS.none
            : `${formatDateTime(disclosure.updatedAt)} ${
                isNullOrUndefined(disclosure.updatedBy?.name)
                  ? ""
                  : `${STRINGS.by} ${disclosure.updatedBy?.name}`
              }`
        }
      />
      <DetailItem
        icon={<Comment />}
        label={STRINGS.initial_note}
        value={disclosure.initialNote || STRINGS.none}
      />
    </Stack>
  </Stack>
);

export default DisclosureHeaderCard;
