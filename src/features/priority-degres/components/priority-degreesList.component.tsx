import Nodata from '@/core/components/common/no-data/no-data.component';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import STRINGS from '@/core/constants/strings.constant';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import PriorityDegreeCard from './priority-degree-card.component';
import type { TPriorityDegree } from '../types/priority-degree.types';

interface IPriorityDegreesList {
  onEdit?: (d: TPriorityDegree) => void;
  priorityDegrees: TPriorityDegree[];
  isLoadingPriorityDegrees: boolean;
}

function PriorityDegreesList({ onEdit, priorityDegrees, isLoadingPriorityDegrees }: IPriorityDegreesList) {
  // const { openModal } = useModal();

  // const handleDelete = useCallback(
  //   (name: string) => {
  //     openModal({
  //       name: "CONFIRM_MODAL",
  //       props: {
  //         message: "Are you sure you want to delete this item?",
  //         onConfirm: () => {
  //           console.log("delete priority degree:", name);
  //           // call delete mutation here if you have one
  //         },
  //       },
  //     });
  //   },
  //   [openModal]
  // );

  return (
    <>
      {priorityDegrees.length === 0 && !isLoadingPriorityDegrees && (
        <Nodata icon={CrisisAlertIcon} title={STRINGS.no_data_found} subTitle={STRINGS.add_to_see} />
      )}

      <VirtualizedList isLoading={isLoadingPriorityDegrees} items={priorityDegrees}>
        {({ item }) => (
          <PriorityDegreeCard
            priorityDegree={item}
            onEdit={onEdit ? () => onEdit(item) : undefined}
            // onDelete={() => handleDelete(item.name)}
          />
        )}
      </VirtualizedList>
    </>
  );
}

export default PriorityDegreesList;
