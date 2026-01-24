import { Typography, Box, Avatar, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { Business as BuildingOfficeIcon } from '@mui/icons-material';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import type { TCity } from '@/features/banks/types/city.types';
import { indigo, lightBlue } from '@mui/material/colors';
import STRINGS from '@/core/constants/strings.constant';

interface ICityCardProps {
  city: TCity;
  onEdit: () => void;
}

const CityCard = ({ city, onEdit }: ICityCardProps) => {
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
          <BuildingOfficeIcon sx={{ color: 'white' }} />
        </Avatar>
        <Typography
          variant="h6"
          component="div"
          color="white"
          fontWeight="semibold"
          noWrap
          sx={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {city.name}
        </Typography>
      </Box>

      <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
        {/* <Tooltip title="Delete Employee" arrow>
          <span>
            <CustomIconButton disabled onClick={onDelete} size="small">
              <DeleteOutlineIcon sx={{ color: "white" }} />
            </CustomIconButton>
          </span>
        </Tooltip> */}
        <Tooltip title={STRINGS.edit_city} arrow>
          <CustomIconButton onClick={onEdit} size="small">
            <EditIcon sx={{ color: 'white' }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      bodyContent={null}
      footerContent={null}
      headerBackground={`linear-gradient(to right, ${lightBlue[300]}, ${indigo[300]})`}
    />
  );
};

export default CityCard;
