import { memo } from 'react';
import { Box } from '@mui/material';
import { Business as BuildingOfficeIcon, Edit as PencilIcon } from '@mui/icons-material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import type { TArea } from '@/features/banks/types/work-areas.types';
import STRINGS from '@/core/constants/strings.constant';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';

interface IWorkAreaCardProps {
  workArea: TArea;
  onEdit: () => void;
}

const WorkAreaCard = ({ workArea, onEdit }: IWorkAreaCardProps) => {
  const headerContent = (
    <CardAvatar
      icon={<BuildingOfficeIcon />}
      name={workArea.name}
      actions={[{ icon: <PencilIcon />, onClick: onEdit }]}
    />
  );
  // const headerContent = (
  //   <Box
  //     sx={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'space-between',
  //       width: '100%',
  //     }}
  //   >
  //     <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
  //       <Avatar
  //         sx={{
  //           bgcolor: 'rgba(255,255,255,0.2)',
  //           width: 48,
  //           height: 48,
  //           mr: 2,
  //         }}
  //       >
  //         <BuildingOfficeIcon sx={{ color: 'white' }} />
  //       </Avatar>
  //       <Typography
  //         variant="h6"
  //         component="h3"
  //         sx={{
  //           fontWeight: 'semibold',
  //           color: 'white',
  //           flexShrink: 1,
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //         }}
  //         noWrap
  //       >
  //         {workArea.name}
  //       </Typography>
  //     </Box>
  //
  //     <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
  //       <Tooltip title={STRINGS.edit_work_area}>
  //         <CustomIconButton onClick={onEdit} size="small">
  //           <PencilIcon sx={{ fontSize: 20, color: 'white' }} />
  //         </CustomIconButton>
  //       </Tooltip>
  //       {/* <Tooltip
  //         title={
  //           workArea.employeeCount > 0
  //             ? "Cannot delete: employees assigned"
  //             : "Delete work area"
  //         }
  //       > */}
  //       {/* <CustomIconButton disabled onClick={onDelete} size="small">
  //         <TrashIcon
  //           sx={{
  //             fontSize: 20,
  //             color: "white",
  //           }}
  //         />
  //       </CustomIconButton> */}
  //       {/* </Tooltip> */}
  //     </Stack>
  //   </Box>
  // );

  const bodyContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DetailItemComponent icon={<LocationCityIcon fontSize="small" />} label={STRINGS.city} value={'TO BE ADDED'} />
      {/*    <DetailItemComponent
        icon={<UsersIcon fontSize="small" />}
        label="Employees"
        value={`${workArea.employeeCount} assigned`}
      /> */}
      {/* <DetailItemComponent
        icon={<BuildingOfficeIcon fontSize="small" />}
        label="Created"
        value={new Date(workArea.createdDate).toLocaleDateString()}
      /> */}
    </Box>
  );

  return <ReusableCardComponent headerContent={headerContent} bodyContent={bodyContent} footerContent={null} />;
};

export default memo(WorkAreaCard);
