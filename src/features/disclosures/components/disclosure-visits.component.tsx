import { Button, Stack, Typography } from '@mui/material';
import type { TVisit } from '../types/disclosure.types';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { deepPurple } from '@mui/material/colors';
import STRINGS from '@/core/constants/strings.constant';
// import { formatDateTime } from "@/core/helpers/helpers";
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import {
  Comment,
  Edit,
  // EventAvailable,
  HelpOutlined,
  // History,
} from '@mui/icons-material';
// import Nodata from "@/core/components/common/no-data/no-data.component";
// import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import { Link, useLocation } from 'react-router-dom';
// import { useVisitsLoader } from "../hooks/visits-loader.hook";
// import { DEFAULT_PAGE_SIZE } from "@/core/constants/properties.constant";

const VisitCard = ({ visit }: { visit: TVisit }) => {
  const { pathname } = useLocation();
  const disclosureId = pathname.split('/').pop() || '';
  return (
    <ReusableCardComponent
      headerContent={<Typography color="white">{visit.visitResult && STRINGS[visit.visitResult]}</Typography>}
      headerBackground={`linear-gradient(to right, ${deepPurple[800]}, ${deepPurple[500]})`}
      bodyContent={
        <Stack gap={2}>
          {visit.visitResult !== 'completed' && (
            <DetailItem icon={<HelpOutlined />} label={STRINGS.visit_reason} value={visit.visitReason ?? ''} />
          )}
          {/* <DetailItem
            icon={<EventAvailable />}
            label={STRINGS.created_at}
            value={`${formatDateTime(visit.createdAt)} ${STRINGS.by} ${
              visit.createdBy?.name
            }`}
          /> */}

          {/* <DetailItem
            icon={<History />}
            label={STRINGS.updated_at}
            value={
              !visit.updatedAt || visit.updatedAt === visit.createdAt
                ? STRINGS.none
                : `${formatDateTime(visit.updatedAt)} ${STRINGS.by} ${
                    visit.updatedBy?.name
                  }`
            }
          /> */}
          <DetailItem icon={<Comment />} label={STRINGS.note} value={visit.visitNote || STRINGS.none} />
        </Stack>
      }
      footerContent={
        <Link style={{ alignSelf: 'end' }} to={`/disclosures/${disclosureId}/visit/action`}>
          <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
        </Link>
      }
    />
  );
};

// const DisclosureVisits = ({ disclosureId }: { disclosureId?: string }) => {
const DisclosureVisits = ({ visit }: { visit: TVisit }) => {
  // const { items, isFetching } = useVisitsLoader({
  //   disclosureId: disclosureId!,
  //   pageSize: DEFAULT_PAGE_SIZE,
  // });

  return (
    <Stack gap={2}>
      visit
      {/* {items.map((v) => ( */}
      <VisitCard visit={visit} />
      {/* ))} */}
      {/* {!isFetching && !items.length && <Nodata />} */}
      {/* {isFetching && <LoadingOverlay />} */}
    </Stack>
  );
};

export default DisclosureVisits;
