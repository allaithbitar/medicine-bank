import VirtualizedList from "@/core/components/common/virtualized-list/virtualized-list.component";
import Nodata from "@/core/components/common/no-data/no-data.component";
import STRINGS from "@/core/constants/strings.constant";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import type { TFamilyMember } from "../../types/beneficiary.types";
import FamilyMemberCard from "./family-member-card.component";

const FamilyMembersList = ({
  familyMembers,
  isLoading,
  onEdit,
}: {
  familyMembers: TFamilyMember[];
  isLoading: boolean;
  onEdit: (m: TFamilyMember) => void;
}) => {
  return (
    <>
      {familyMembers.length === 0 && !isLoading && (
        <Nodata
          icon={Diversity3Icon}
          title={STRINGS.no_data_found}
          subTitle={STRINGS.add_to_see}
        />
      )}

      <VirtualizedList
        isLoading={isLoading}
        items={familyMembers}
        containerStyle={{ flex: 1 }}
        virtualizationOptions={{ count: familyMembers.length }}
      >
        {({ item }) => <FamilyMemberCard member={item} onEdit={onEdit} />}
      </VirtualizedList>
    </>
  );
};

export default FamilyMembersList;
