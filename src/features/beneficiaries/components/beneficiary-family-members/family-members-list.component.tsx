import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import Nodata from '@/core/components/common/no-data/no-data.component';
import STRINGS from '@/core/constants/strings.constant';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import type { TFamilyMember } from '../../types/beneficiary.types';
import FamilyMemberCard from './family-member-card.component';
import { Button, Card, Stack } from '@mui/material';

const FamilyMembersList = ({
  familyMembers,
  isLoading,
  onEdit,
  onAdd,
}: {
  familyMembers: TFamilyMember[];
  isLoading: boolean;
  onEdit: (m: TFamilyMember) => void;
  onAdd: () => void;
}) => {
  return (
    <Stack>
      {familyMembers.length === 0 && !isLoading && (
        <Card>
          <Nodata
            icon={Diversity3Icon}
            title={STRINGS.no_family_members}
            extra={<Button onClick={onAdd}>{STRINGS.add}</Button>}
          />
        </Card>
      )}

      <VirtualizedList
        isLoading={isLoading}
        items={familyMembers}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{ count: familyMembers.length }}
      >
        {({ item }) => <FamilyMemberCard member={item} onEdit={onEdit} />}
      </VirtualizedList>
    </Stack>
  );
};

export default FamilyMembersList;
