import { Button, Chip, Stack } from "@mui/material";
import type { TDisclosure } from "../types/disclosure.types";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import {
  InfoOutline,
  Person,
  PriorityHighOutlined,
  Visibility,
} from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import { purple } from "@mui/material/colors";
import CardAvatar from "@/core/components/common/reusable-card/card-avatar.component";
import { Link } from "react-router-dom";

const DisclosureCard = ({ disclosure }: { disclosure: TDisclosure }) => {
  const headerContent = <CardAvatar name={disclosure.patient.name} />;

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<InfoOutline />}
        label={STRINGS.status}
        iconColorPreset="green"
        value={STRINGS[disclosure.status]}
      />

      <DetailItemComponent
        icon={<Person />}
        label={STRINGS.disclosure_scout}
        iconColorPreset="green"
        value={disclosure.scout?.name ?? STRINGS.none}
      />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.disclosure_created_at}
        iconColorPreset="blue"
        value={formatDateTime(disclosure.createdAt)}
      />
    </Stack>
  );

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${purple[800]}, ${purple[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Chip
            variant="filled"
            label={disclosure.priority.name}
            sx={{
              background: `${disclosure.priority.color}`,
              color: (theme) => theme.palette.info.contrastText,
              zIndex: 1,
            }}
          />

          <Link to={`/disclosures/${disclosure.id}`}>
            <Button variant="outlined" startIcon={<Visibility />}>
              عرض
            </Button>
          </Link>
        </Stack>
      }
    />
  );
};

export default DisclosureCard;
