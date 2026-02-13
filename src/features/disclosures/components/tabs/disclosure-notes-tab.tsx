import type { TDisclosure, TDisclosureNote } from '@/features/disclosures/types/disclosure.types';
import { useDisclosureNotesLoader } from '../../hooks/disclosure-notes-loader.hook';
import { Button, Divider, Stack, Typography } from '@mui/material';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import STRINGS from '@/core/constants/strings.constant';
import { Comment, Edit, Note } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/core/hooks/user-user.hook';
import { baseUrl } from '@/core/api/root.api';
// import { indigo } from '@mui/material/colors';
import { getVoiceSrc } from '@/core/helpers/helpers';
import Nodata from '@/core/components/common/no-data/no-data.component';
import useIsOffline from '@/core/hooks/use-is-offline.hook';
import { readAudioFile } from '@/core/helpers/opfs-audio.helpers';

const NoteCard = ({ note, canEditNote }: { note: TDisclosureNote; canEditNote?: boolean }) => {
  const isOffline = useIsOffline();
  const [offlineAudioObjectUrl, setOfflineAudioObjectUrl] = useState('');

  const { id: currentUserId } = useUser();
  const navigate = useNavigate();

  const handleEditClick = useCallback(() => {
    navigate(`/disclosures/${note.disclosureId}/note/action?id=${note.id}`);
  }, [navigate, note.disclosureId, note.id]);

  useEffect(() => {
    if (!isOffline) return;
    if (note.noteAudio) {
      (async () => {
        const offlineAudioFile = await readAudioFile(note.noteAudio!);
        if (offlineAudioFile) {
          setOfflineAudioObjectUrl(URL.createObjectURL(offlineAudioFile));
        }
      })();
    }
    return () => {
      if (offlineAudioObjectUrl) {
        URL.revokeObjectURL(offlineAudioObjectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOffline]);

  return (
    <ReusableCardComponent
      cardSx={{ minHeight: 200 }}
      // headerBackground={`linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`}
      headerContent={
        <CardAvatar
          name={`${STRINGS.note} - ${note.createdBy?.name}`}
          icon={<Comment />}
          actions={
            note.createdBy?.id === currentUserId && canEditNote
              ? [{ icon: <Edit />, onClick: handleEditClick }]
              : undefined
          }
        />
      }
      bodyContent={
        <Stack gap={2} alignItems="center">
          {note.noteText && <Typography alignSelf="start">{note.noteText}</Typography>}
          {note.noteAudio && (
            <>
              <Divider flexItem />
              <audio
                controlsList="nodownload"
                controls
                src={offlineAudioObjectUrl || getVoiceSrc({ baseUrl, filePath: note.noteAudio })}
              />
            </>
          )}
        </Stack>
      }
    />
  );
};

const DisclosureNotesTab = ({
  disclosureId,
  disclosure,
  openNoteAction,
}: {
  disclosureId?: string;
  disclosure?: TDisclosure;
  openNoteAction?: () => void;
}) => {
  const { items, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, totalCount } = useDisclosureNotesLoader({
    disclosureId: disclosureId ?? '',
  });
  const isArchived = disclosure?.status === 'archived';

  return (
    <Stack sx={{ position: 'relative', height: '100%' }}>
      <VirtualizedList
        totalCount={totalCount}
        isLoading={isFetchingNextPage}
        items={items}
        noDataSlot={
          <Nodata
            icon={Note}
            title={STRINGS.no_notes}
            extra={
              <Button onClick={openNoteAction} disabled={isArchived}>
                {STRINGS.add}
              </Button>
            }
          />
        }
        onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
      >
        {({ item }) => {
          return <NoteCard canEditNote={!isArchived} note={item} />;
        }}
      </VirtualizedList>

      {isFetching && !isFetchingNextPage && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureNotesTab;
