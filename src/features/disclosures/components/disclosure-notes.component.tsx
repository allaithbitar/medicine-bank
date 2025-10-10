import { Button, Stack, Typography } from "@mui/material";
import disclosuresApi from "../api/disclosures.api";
import type { TDisclosureNote } from "../types/disclosure.types";
import DetailItem from "@/core/components/common/detail-item/detail-item.component";
import STRINGS from "@/core/constants/strings.constant";
import { Comment, Edit, Person } from "@mui/icons-material";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import { indigo } from "@mui/material/colors";
import LoadingOverlay from "@/core/components/common/loading-overlay/loading-overlay";
import Nodata from "@/core/components/common/no-data/no-data.component";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useUser from "@/core/hooks/user-user.hook";
import { notifyInfo } from "@/core/components/common/toast/toast";

const NoteCard = ({ note }: { note: TDisclosureNote }) => {
  const { id: currentUserId } = useUser();
  const navigate = useNavigate();

  const handleEditClick = useCallback(() => {
    const noteCreatorId = note.createdBy?.id;
    const hasAccess = noteCreatorId === currentUserId;
    if (hasAccess) {
      navigate(`/disclosures/${note.disclosureId}/note/action`, {
        state: { oldNote: note },
      });
    } else {
      notifyInfo(STRINGS.no_access);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, note]);
  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`}
      headerContent={<Typography color="white">{STRINGS.note}</Typography>}
      bodyContent={
        <Stack gap={2}>
          <DetailItem
            icon={<Comment />}
            label={STRINGS.details}
            value={note.note}
          />
          <DetailItem
            icon={<Person />}
            label={STRINGS.created_By}
            value={note.createdBy?.name}
          />
        </Stack>
      }
      footerContent={
        <Button
          sx={{ placeSelf: "end" }}
          onClick={handleEditClick}
          startIcon={<Edit />}
        >
          {STRINGS.edit}
        </Button>
      }
    />
  );
};

const DisclosureNotes = ({ disclosureId }: { disclosureId?: string }) => {
  const { data: { items: notes } = { items: [] }, isFetching } =
    disclosuresApi.useGetDisclosureNotesQuery(
      { disclosureId: disclosureId! },
      { skip: !disclosureId }
    );

  return (
    <Stack gap={2} sx={{ position: "relative" }}>
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} />
      ))}
      {!isFetching && !notes.length && <Nodata />}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureNotes;
