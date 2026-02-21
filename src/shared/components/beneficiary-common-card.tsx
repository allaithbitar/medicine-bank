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
import disclosuresApi from '@/features/disclosures/api/disclosures.api';
import FormattedVisitRatingResult from '@/features/disclosures/components/formatted-visit-rating-result';
import { useCallback } from 'react';
import PhoneActionsMenu from '@/core/components/common/phone-actions-menu/phone-actions-menu.component';
import InlineEditWrapper from '@/core/components/common/inline-edit-wrapper/inline-edit-wrapper.component';
import useBeneficiaryFieldMutation from '@/features/beneficiaries/hooks/use-beneficiary-field-mutation.hook';
import { beneficiaryFieldSchemas } from '@/features/beneficiaries/validation/beneficiary-fields.validation';

interface IBeneficiaryCommonCard {
  beneficiary: TBenefieciary;
  isDisclosurePage?: boolean;
  canEditPatient?: boolean;
  disclosureId?: string;
}

function BeneficiaryCommonCard({
  beneficiary,
  isDisclosurePage = false,
  canEditPatient = false,
  disclosureId,
}: IBeneficiaryCommonCard) {
  const { data: disclosure } = disclosuresApi.useGetLastDisclosureQuery(
    { patientId: beneficiary.id },
    { skip: !beneficiary.id || isDisclosurePage }
  );

  const updateBeneficiaryField = useBeneficiaryFieldMutation(beneficiary, { disclosureId });

  const getPhoneValues = useCallback(() => {
    if (!beneficiary?.phones?.length) {
      return STRINGS.none;
    }
    return (
      <Stack spacing={0.5}>
        {beneficiary.phones.map((p) => (
          <PhoneActionsMenu key={p.id} phone={p.phone} />
        ))}
      </Stack>
    );
  }, [beneficiary.phones]);

  return (
    <Stack gap={2}>
      <DetailItem
        label={STRINGS.beneficiary}
        icon={<Person />}
        value={
          <InlineEditWrapper
            editValue={beneficiary.name}
            fieldType="text"
            fieldKey="name"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.name}
          >
            {beneficiary.name}
          </InlineEditWrapper>
        }
      />
      <DetailItem
        label={STRINGS.national_number}
        icon={<Pin />}
        value={
          <InlineEditWrapper
            editValue={beneficiary.nationalNumber}
            fieldType="text"
            fieldKey="nationalNumber"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.nationalNumber}
          >
            {beneficiary.nationalNumber ?? STRINGS.none}
          </InlineEditWrapper>
        }
      />
      <DetailItem label={STRINGS.phones} icon={<Phone />} value={getPhoneValues()} />
      <DetailItem
        icon={<CalendarTodayIcon />}
        label={STRINGS.birth_date}
        value={
          <InlineEditWrapper
            editValue={beneficiary.birthDate}
            fieldType="date"
            fieldKey="birthDate"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.birthDate}
          >
            {beneficiary.birthDate || STRINGS.none}
          </InlineEditWrapper>
        }
      />
      {!isDisclosurePage && (
        <DetailItem
          icon={<WorkIcon />}
          label={STRINGS.job_or_school}
          value={
            <InlineEditWrapper
              editValue={beneficiary.job}
              fieldType="text"
              fieldKey="job"
              onSave={updateBeneficiaryField}
              canEdit={canEditPatient}
              validation={beneficiaryFieldSchemas.job}
            >
              {beneficiary.job ? beneficiary.job : STRINGS.none}
            </InlineEditWrapper>
          }
        />
      )}
      <DetailItem
        icon={<LocationPin />}
        label={STRINGS.patient_address}
        value={
          <InlineEditWrapper
            editValue={beneficiary.address}
            fieldType="text"
            fieldKey="address"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.address}
          >
            {beneficiary.address
              ? `${beneficiary.area?.name ?? ''}  - ${beneficiary.address || ''}`
              : (beneficiary.area?.name ?? '')}
          </InlineEditWrapper>
        }
      />
      <DetailItem
        icon={<Man4Icon />}
        label={STRINGS.gender}
        value={
          <InlineEditWrapper
            editValue={beneficiary.gender}
            fieldType="select"
            fieldKey="gender"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.gender}
            selectOptions={[{ id: 'male' }, { id: 'female' }]}
            getOptionLabel={(option) => STRINGS[option.id as 'male' | 'female']}
            disableClearable
          >
            {beneficiary.gender ? STRINGS[beneficiary.gender] : STRINGS.none}
          </InlineEditWrapper>
        }
      />

      <DetailItem
        icon={<EventAvailable />}
        label={STRINGS.Patient_created_at}
        value={beneficiary.createdAt ? formatDateTime(beneficiary.createdAt) : STRINGS.undefined}
      />
      <DetailItem
        icon={<History />}
        label={STRINGS.patient_updated_at}
        value={beneficiary.updatedAt ? formatDateTime(beneficiary.updatedAt) : STRINGS.undefined}
      />
      {disclosure && !isDisclosurePage && <FormattedVisitRatingResult disclosure={disclosure} />}
      <DetailItem
        icon={<Info />}
        label={STRINGS.patient_about}
        value={
          <InlineEditWrapper
            editValue={beneficiary.about}
            fieldType="textarea"
            fieldKey="about"
            onSave={updateBeneficiaryField}
            canEdit={canEditPatient}
            validation={beneficiaryFieldSchemas.about}
          >
            {beneficiary.about ? beneficiary.about : STRINGS.none}
          </InlineEditWrapper>
        }
      />
      {canEditPatient && (
        <Link to={`/beneficiaries/action?beneficiaryId=${beneficiary.id}`}>
          <Button fullWidth startIcon={<Edit />}>
            {STRINGS.edit} {STRINGS.the_patient}
          </Button>
        </Link>
      )}
    </Stack>
  );
}

export default BeneficiaryCommonCard;
