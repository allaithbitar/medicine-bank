import { Box, Avatar, Typography, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import type { TPriorityDegree } from '../types/priority-degree.types';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import { indigo } from '@mui/material/colors';
import STRINGS from '@/core/constants/strings.constant';

interface IProps {
  priorityDegree: TPriorityDegree;
  onEdit: () => void;
}

const PriorityDegreeCard = ({ priorityDegree, onEdit }: IProps) => {
  const headerContent = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          <CrisisAlertIcon />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          color="white"
          fontWeight="semibold"
          noWrap
          sx={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {priorityDegree.name}
        </Typography>
      </Box>
      <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
        {/* <Tooltip title="Delete" arrow>
          <span>
            <CustomIconButton onClick={onDelete} size="small" disabled>
              <DeleteOutlineIcon sx={{ color: "white" }} />
            </CustomIconButton>
          </span>
        </Tooltip> */}
        <Tooltip title={STRINGS.edit_priority_degree} arrow>
          <CustomIconButton onClick={onEdit} size="small">
            <EditIcon sx={{ color: 'white' }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  const headerBackground =
    priorityDegree.color && priorityDegree.color.trim() !== '' ? priorityDegree.color : indigo[300];

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={null}
      footerContent={null}
      headerBackground={headerBackground}
    />
  );
};

export default PriorityDegreeCard;
