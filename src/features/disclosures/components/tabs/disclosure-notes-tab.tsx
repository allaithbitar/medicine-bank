import type { TDisclosure, TDisclosureNote } from '@/features/disclosures/types/disclosure.types';
import { useDisclosureNotesLoader } from '../../hooks/disclosure-notes-loader.hook';
import { Divider, Stack, Typography } from '@mui/material';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import STRINGS from '@/core/constants/strings.constant';
import { Comment, Edit } from '@mui/icons-material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/core/hooks/user-user.hook';
import { baseUrl } from '@/core/api/root.api';
import { indigo } from '@mui/material/colors';
import { getVoiceSrc } from '@/core/helpers/helpers';

const NoteCard = ({ note }: { note: TDisclosureNote }) => {
  const { id: currentUserId } = useUser();
  const navigate = useNavigate();

  const handleEditClick = useCallback(() => {
    navigate(`/disclosures/${note.disclosureId}/note/action?id=${note.id}`);
  }, [navigate, note.disclosureId, note.id]);

  return (
    <ReusableCardComponent
      cardSx={{ minHeight: 200 }}
      headerBackground={`linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`}
      headerContent={
        <CardAvatar
          name={`${STRINGS.note} - ${note.createdBy?.name}`}
          icon={<Comment />}
          actions={note.createdBy?.id === currentUserId ? [{ icon: <Edit />, onClick: handleEditClick }] : undefined}
        />
      }
      bodyContent={
        <Stack gap={2} alignItems="center">
          {note.noteText && <Typography alignSelf="start">{note.noteText}</Typography>}
          {note.noteAudio && (
            <>
              <Divider flexItem />
              <audio controlsList="nodownload" controls src={getVoiceSrc({ baseUrl, filePath: note.noteAudio })} />
            </>
          )}
        </Stack>
      }
    />
  );
};

const DisclosureNotesTab = ({
  disclosureId,
}: {
  disclosureId?: string;
  disclosure?: TDisclosure;
  handleOpenBeneficiaryMedicineActionPage?: (bm?: any) => void;
  handleOpenFamilyMembersActionPage?: (m?: any) => void;
  openNoteAction?: () => void;
}) => {
  const { items, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, totalCount } = useDisclosureNotesLoader({
    disclosureId: disclosureId ?? '',
  });

  return (
    <Stack sx={{ position: 'relative', height: '100%' }}>
      <VirtualizedList
        totalCount={totalCount}
        isLoading={isFetchingNextPage}
        items={items}
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
      >
        {({ item }) => {
          return <NoteCard note={item} />;
        }}
      </VirtualizedList>

      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureNotesTab;
