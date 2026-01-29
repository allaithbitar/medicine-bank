import { Box, Avatar, Stack, Tooltip, Typography } from '@mui/material';
import { cyan } from '@mui/material/colors';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import CustomIconButton from '@/core/components/common/custom-icon-button/custom-icon-button.component';
import STRINGS from '@/core/constants/strings.constant';
import { Edit, DeleteOutline, Home, Pin, ChildCare } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import type { TFamilyMember } from '../../types/beneficiary.types';
import { formatDateTime, getStringsLabel } from '@/core/helpers/helpers';

const FamilyMemberCard = ({ member, onEdit }: { member: TFamilyMember; onEdit: (m: TFamilyMember) => void }) => {
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
          <PersonIcon sx={{ color: 'white' }} />
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="div"
            color="white"
            fontWeight="semibold"
            noWrap
            sx={{ flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {member.name}
          </Typography>
          <Typography variant="caption" color="rgba(255,255,255,0.85)" noWrap>
            {getStringsLabel({ key: 'kinship', val: member.kinshep })} • {STRINGS[member.gender]}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" gap={1} sx={{ color: 'white', flexShrink: 0, ml: 2 }}>
        <Tooltip title={STRINGS.delete} arrow>
          <span>
            <CustomIconButton disabled size="small">
              <DeleteOutline sx={{ color: 'white' }} />
            </CustomIconButton>
          </span>
        </Tooltip>

        <Tooltip title={STRINGS.edit} arrow>
          <CustomIconButton onClick={() => onEdit(member)} size="small">
            <Edit sx={{ color: 'white' }} />
          </CustomIconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <ReusableCardComponent
      headerContent={headerContent}
      headerBackground={cyan[700]}
      bodyContent={
        <Stack gap={2}>
          <DetailItemComponent
            icon={<Pin />}
            label={STRINGS.national_number}
            value={member.nationalNumber ?? STRINGS.none}
          />

          <DetailItemComponent
            label={STRINGS.birth_date}
            icon={<CakeIcon />}
            value={formatDateTime(member.birthDate, false, { year: 'numeric' })}
          />
          <DetailItemComponent label={STRINGS.job_or_school} icon={<WorkIcon />} value={member.jobOrSchool} />
          <DetailItemComponent label={STRINGS.residential} icon={<Home />} value={member.residential ?? STRINGS.none} />
          <DetailItemComponent
            label={STRINGS.kids_count}
            icon={<ChildCare />}
            value={String(member.kidsCount || STRINGS.none)}
          />

          {member.note ? <DetailItemComponent label={STRINGS.note} icon={<PersonIcon />} value={member.note} /> : null}
        </Stack>
      }
      footerContent={null}
    />
  );
};

export default FamilyMemberCard;
