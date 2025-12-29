import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import Header from "@/core/components/common/header/header";
import STRINGS from "@/core/constants/strings.constant";
import { Comment, HelpOutlined, RateReview } from "@mui/icons-material";
import { Stack, Divider, Typography } from "@mui/material";
import type { TDisclosure } from "../types/disclosure.types";

function DisclosureVisitAndRatingSection({
  disclosure,
}: {
  disclosure: TDisclosure;
}) {
  return (
    <Stack>
      <Divider />
      <Header title={`${STRINGS.visit} ${STRINGS.and} ${STRINGS.rating}`} />
      <Stack>
        <Stack gap={2}>
          {disclosure.visitResult && (
            <Typography>
              {STRINGS.visit} {STRINGS[disclosure.visitResult]}
            </Typography>
          )}
          <DetailItem
            icon={<HelpOutlined />}
            label={STRINGS.visit_reason}
            value={disclosure.visitReason ?? STRINGS.none}
          />
          <DetailItem
            icon={<Comment />}
            label={STRINGS.note}
            value={disclosure.visitNote || STRINGS.none}
          />
        </Stack>
        <Stack gap={2}>
          {(disclosure.isCustomRating || disclosure.rating) && (
            <>
              <Divider />
              <Typography>{STRINGS.rating}</Typography>
            </>
          )}
          {disclosure.isCustomRating && (
            <DetailItem
              icon={<RateReview />}
              label={STRINGS.result}
              value={STRINGS.custom_rating}
            />
          )}
          {disclosure.rating && (
            <DetailItem
              icon={<RateReview />}
              label={STRINGS.result}
              value={`  ${disclosure.rating?.name} - ( ${disclosure.rating?.code} )`}
            />
          )}
          {disclosure.isCustomRating && (
            <DetailItem
              icon={<Comment />}
              label={STRINGS.custom_rating}
              value={disclosure.customRating || STRINGS.none}
            />
          )}
          {!disclosure.isCustomRating && disclosure?.rating && (
            <DetailItem
              icon={<Comment />}
              label={STRINGS.note}
              value={disclosure.rating?.name || STRINGS.none}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default DisclosureVisitAndRatingSection;
