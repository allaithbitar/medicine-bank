import { useCallback } from 'react';
import { Button, Card, Stack, Typography } from '@mui/material';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Comment, Edit, Person } from '@mui/icons-material';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import STRINGS from '@/core/constants/strings.constant';
import { indigo } from '@mui/material/colors';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Nodata from '@/core/components/common/no-data/no-data.component';
import { Link, useNavigate } from 'react-router-dom';
import useUser from '@/core/hooks/user-user.hook';
import { notifyInfo } from '@/core/components/common/toast/toast';
import disclosuresApi from '../api/disclosures.api';
import type { TDisclosureNote } from '../types/disclosure.types';
import { baseUrl } from '@/core/api/root.api';

const NoteCard = ({ note }: { note: TDisclosureNote }) => {
  const { id: currentUserId } = useUser();
  const navigate = useNavigate();

  const handleEditClick = useCallback(() => {
    const noteCreatorId = (note.createdBy as any)?.id ?? note.createdBy;
    const hasAccess = noteCreatorId === currentUserId;
    if (hasAccess) {
      navigate(`/disclosures/${note.disclosureId}/note/action?id=${note.id}`);
    } else {
      notifyInfo(STRINGS.no_access);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, note]);
  const VoiceSrc = `${baseUrl}/public/audio/${note.noteAudio}`;

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${indigo[800]}, ${indigo[500]})`}
      headerContent={<Typography color="white">{STRINGS.note}</Typography>}
      bodyContent={
        <Stack gap={2}>
          <DetailItem icon={<Comment />} label={STRINGS.details} value={note.noteText} />
          <DetailItem
            icon={<Person />}
            label={STRINGS.created_By}
            value={(note.createdBy as any)?.name ?? note.createdBy}
          />

          {note.noteAudio ? (
            <DetailItem
              icon={<VolumeDownIcon />}
              label={''}
              value={
                <Stack direction="row" alignItems="center">
                  <audio controlsList="nodownload" controls src={VoiceSrc}>
                    Your browser does not support the audio element.
                  </audio>
                </Stack>
              }
            />
          ) : null}
        </Stack>
      }
      footerContent={
        <Button sx={{ placeSelf: 'end' }} onClick={handleEditClick} startIcon={<Edit />}>
          {STRINGS.edit}
        </Button>
      }
    />
  );
};

const DisclosureNotes = ({ disclosureId }: { disclosureId?: string }) => {
  const { data: response = { items: [] }, isFetching } = disclosuresApi.useGetDisclosureNotesQuery(
    { disclosureId: disclosureId! },
    { skip: !disclosureId }
  );
  const notes = response.items ?? [];

  return (
    <Stack gap={2} sx={{ position: 'relative' }}>
      {notes.map((n) => (
        <NoteCard key={n.id} note={n} />
      ))}
      {!isFetching && !notes.length && (
        <Card>
          <Nodata
            title={STRINGS.no_notes}
            extra={
              <Link to={`/disclosures/${disclosureId}/note/action`}>
                <Button>{STRINGS.add}</Button>
              </Link>
            }
          />
        </Card>
      )}
      {isFetching && <LoadingOverlay />}
    </Stack>
  );
};

export default DisclosureNotes;
