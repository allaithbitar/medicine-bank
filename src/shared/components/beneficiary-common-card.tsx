import DetailItem from '@/core/components/common/detail-item/detail-item.component';
import STRINGS from '@/core/constants/strings.constant';
import { formatDateTime } from '@/core/helpers/helpers';
import type { TBenefieciary } from '@/features/beneficiaries/types/beneficiary.types';
import Man4Icon from '@mui/icons-material/Man4';
import { Person, Pin, Phone, LocationPin, EventAvailable, Info, Edit, History } from '@mui/icons-material';
import { Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';

interface IBeneficiaryCommonCard {
  beneficiary: TBenefieciary;
  isDisclosurePage?: boolean;
}

function BeneficiaryCommonCard({ beneficiary, isDisclosurePage = false }: IBeneficiaryCommonCard) {
  return (
    <Stack gap={2}>
      <DetailItem label={STRINGS.beneficiary} icon={<Person />} value={beneficiary.name} />
      <DetailItem label={STRINGS.national_number} icon={<Pin />} value={beneficiary.nationalNumber ?? STRINGS.none} />
      <DetailItem label={STRINGS.phones} icon={<Phone />} value={beneficiary?.phones?.map((p) => p.phone).join(', ')} />
      {
        <DetailItem
          icon={<CalendarTodayIcon />}
          label={STRINGS.birth_date}
          value={beneficiary.birthDate || STRINGS.none}
        />
      }
      {!isDisclosurePage && (
        <DetailItem
          icon={<WorkIcon />}
          label={STRINGS.job_or_school}
          value={beneficiary.job ? beneficiary.job : STRINGS.none}
        />
      )}
      <DetailItem
        icon={<LocationPin />}
        label={STRINGS.patient_address}
        value={`${beneficiary.area?.name ?? ''}  - ${beneficiary.address}`}
      />
      <DetailItem
        icon={<Man4Icon />}
        label={STRINGS.gender}
        value={beneficiary.gender ? STRINGS[beneficiary.gender] : STRINGS.none}
      />

      <DetailItem
        icon={<EventAvailable />}
        label={STRINGS.Patient_created_at}
        value={formatDateTime(beneficiary.createdAt)}
      />
      <DetailItem icon={<History />} label={STRINGS.patient_updated_at} value={formatDateTime(beneficiary.updatedAt)} />
      <DetailItem
        icon={<Info />}
        label={STRINGS.patient_about}
        value={beneficiary.about ? beneficiary.about : STRINGS.none}
      />
      <Link to={`/beneficiaries/action?beneficiaryId=${beneficiary.id}`}>
        <Button fullWidth startIcon={<Edit />}>
          {STRINGS.edit} {STRINGS.patient}
        </Button>
      </Link>
    </Stack>
  );
}

export default BeneficiaryCommonCard;
