import STRINGS from '@/core/constants/strings.constant';
import {
  Card,
  Stack,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import type { TAddBeneficiaryDto, TBenefieciary } from '../types/beneficiary.types';
import { useCallback, useRef, useState, createRef } from 'react';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import type { TBenefificaryFormHandlers } from '../components/beneficiary-action-form.component';
import BeneficiaryActionForm from '../components/beneficiary-action-form.component';
import ActionFab from '@/core/components/common/action-fab/acion-fab.component';
import { Save, Add, DeleteOutlined, ExpandMore } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import Header from '@/core/components/common/header/header';
import useBeneficiaryMutation from '../hooks/beneficiary-mutation.hook';
import { useBeneficiaryLoader } from '../hooks/use-beneficiary-loader.hook';
import beneficiaryApi from '../api/beneficiary.api';
import DisclosureActionForm, {
  type TDisclosureFormHandlers,
} from '@/features/disclosures/components/disclosure-action-form.component';
import DisclosureSubPatientActionForm, {
  type TSubPatientFormHandlers,
} from '@/features/disclosures/components/disclosure-sub-patient-action-form.component';
import useDisclosureMutation from '@/features/disclosures/hooks/disclosure-mutation.hook';
import useDisclosureSubPatientMutation from '@/features/disclosures/hooks/disclosure-sub-patient.mutation.hook';
import type { TAddDisclosureDto } from '@/features/disclosures/types/disclosure.types';

const BeneficiaryActionPage = () => {
  const [searchParams] = useSearchParams();

  const beneficiaryId = searchParams.get('beneficiaryId');

  const ref = useRef<TBenefificaryFormHandlers | null>(null);
  const disclosureRef = useRef<TDisclosureFormHandlers | null>(null);

  const navigate = useNavigate();

  const [mutateBeneficiary, { isLoading: isMutating }] = useBeneficiaryMutation();
  const [mutateDisclosure, { isLoading: isMutatingDisclosure }] = useDisclosureMutation();
  const [mutateSubPatient, { isLoading: isMutatingSubPatients }] = useDisclosureSubPatientMutation();

  const [validateNationalNumber, { isLoading: isValidatingNationalNumber }] =
    beneficiaryApi.useValidateNationalNumberMutation();

  const [validatePhoneNumbers, { isLoading: isValidatingPhoneNumbers }] =
    beneficiaryApi.useValidatePhoneNumbersMutation();

  const [validationErrors, setValidationErrors] = useState<{
    nationalNumber?: string;
    phoneNumbers?: Record<number, string>;
  }>({});
  const [phoneConflict, setPhoneConflict] = useState<{
    patient: TBenefieciary;
    phone?: string | null;
  } | null>(null);
  const [conflictSaveAttempted, setConflictSaveAttempted] = useState(false);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const [subPatientForms, setSubPatientForms] = useState<
    { id: string; ref: React.RefObject<TSubPatientFormHandlers | null> }[]
  >([]);

  const handleAddSubPatient = () => {
    setSubPatientForms((prev) => [...prev, { id: crypto.randomUUID(), ref: createRef<TSubPatientFormHandlers>() }]);
  };

  const handleRemoveSubPatient = (id: string) => {
    setSubPatientForms((prev) => prev.filter((p) => p.id !== id));
  };

  const { data: beneficiaryData, isLoading: isGetting } = useBeneficiaryLoader({ id: beneficiaryId ?? '' });

  const showDisclosureForm = !beneficiaryId && !beneficiaryData && !isGetting;

  const handleAreaChange = useCallback((areaId: string | null) => {
    setSelectedAreaId(areaId);
  }, []);

  const isLoading =
    isMutating ||
    isGetting ||
    isValidatingNationalNumber ||
    isValidatingPhoneNumbers ||
    isMutatingDisclosure ||
    isMutatingSubPatients;

  const handleSave = async () => {
    const { isValid, result } = await ref.current!.handleSubmit();
    if (!isValid) return;

    let disclosureResult = null;
    if (showDisclosureForm) {
      disclosureResult = await disclosureRef.current!.handleSubmit();
      if (!disclosureResult.isValid) return;
    }

    const subPatientValues: any[] = [];
    if (showDisclosureForm && subPatientForms.length > 0) {
      for (const sp of subPatientForms) {
        const spResult = await sp.ref.current?.handleSubmit();
        if (!spResult?.isValid) {
          return;
        }
        const values = spResult.result;
        if (values.gender) {
          values.gender = values.gender.id;
        } else {
          values.gender = null;
        }
        if (values.birthDate && values.birthDate.trim() !== '') {
          values.birthDate = values.birthDate.split('T')[0];
        } else {
          values.birthDate = null;
        }
        subPatientValues.push(values);
      }
    }

    const errors: typeof validationErrors = {};
    let phoneConflictLocal: { patient: TBenefieciary; phone?: string | null } | null = null;
    try {
      if (result.nationalNumber) {
        const { data } = await validateNationalNumber({
          nationalNumber: result.nationalNumber,
          patientId: beneficiaryId || undefined,
        });
        if (data?.existing) {
          errors.nationalNumber = `${STRINGS.already_exists_for_patient}: ${data.existing.name}`;
        }
      }
      if (result.phoneNumbers.length > 0) {
        const { data } = await validatePhoneNumbers({
          phoneNumbers: result.phoneNumbers,
          patientId: beneficiaryId || undefined,
        });

        if (data?.existing?.patient) {
          phoneConflictLocal = data.existing;
        }
      }

      if (errors.nationalNumber) {
        setValidationErrors({ nationalNumber: errors.nationalNumber });
        setPhoneConflict(phoneConflictLocal);
        return;
      }

      setValidationErrors({});
      if (phoneConflictLocal) {
        setPhoneConflict(phoneConflictLocal);
        if (!conflictSaveAttempted) {
          setConflictSaveAttempted(true);
          return;
        }
      } else {
        setPhoneConflict(null);
        setConflictSaveAttempted(false);
      }

      const addDto: TAddBeneficiaryDto = {
        name: result.name,
        nationalNumber: result.nationalNumber || null,
        areaId: result.area?.id || null,
        about: result.about || null,
        address: result.address || null,
        phoneNumbers: result.phoneNumbers,
        gender: (result.gender?.id as any) || null,
        job: result.job || null,
        birthDate: (result.birthDate || '')?.split('T')[0] || null,
      };
      let newBeneficiaryId: string | undefined;
      if (!beneficiaryId) {
        const response = await mutateBeneficiary({ type: 'INSERT', dto: addDto });
        newBeneficiaryId = (response as any)?.id;
        notifySuccess(STRINGS.added_successfully);
      } else {
        await mutateBeneficiary({
          type: 'UPDATE',
          dto: {
            ...addDto,
            id: beneficiaryId,
          },
        });
        notifySuccess(STRINGS.edited_successfully);
      }

      if (showDisclosureForm && disclosureResult && newBeneficiaryId) {
        const disclosureDto: TAddDisclosureDto = {
          type: disclosureResult.result.type!.id,
          patientId: newBeneficiaryId,
          priorityId: disclosureResult.result.priorityDegree!.id,
          scoutId: disclosureResult.result.employee?.id || null,
          initialNote: disclosureResult.result.initialNote || null,
        };

        const disclosureResponse = await mutateDisclosure({ type: 'INSERT', dto: disclosureDto });
        const newDisclosureId = (disclosureResponse as any)?.id;
        notifySuccess(STRINGS.added_successfully);

        if (newDisclosureId && subPatientValues.length > 0) {
          for (const spValues of subPatientValues) {
            try {
              await mutateSubPatient({ type: 'INSERT', dto: { ...spValues, disclosureId: newDisclosureId } });
            } catch (err) {
              notifyError(err);
            }
          }
          notifySuccess(STRINGS.added_successfully);
        }
      }
      navigate(-1);
    } catch (error: any) {
      notifyError(error);
    }
  };

  return (
    <Card>
      <Stack gap={2} sx={{ position: 'relative' }}>
        <Header title={beneficiaryId ? STRINGS.edit : STRINGS.add} showBackButton />
        <BeneficiaryActionForm
          ref={ref}
          beneficiaryData={beneficiaryData}
          validationErrors={validationErrors}
          onAreaChange={handleAreaChange}
          phoneConflict={phoneConflict}
          onPhoneChange={() => {
            setPhoneConflict(null);
            setConflictSaveAttempted(false);
          }}
        />
        {showDisclosureForm && (
          <>
            <Header title={STRINGS.add_disclosure} />
            <DisclosureActionForm ref={disclosureRef} beneficiaryAlreadyDefined={true} areaId={selectedAreaId} />
            <Header title={STRINGS.sub_patients} />
            <Stack gap={2}>
              {subPatientForms.map((sp, index) => (
                <Accordion sx={{ p: 0, boxShadow: 'none' }} key={sp.id} defaultExpanded>
                  <AccordionSummary sx={{ p: 0 }} expandIcon={<ExpandMore />}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                      <Typography variant="subtitle1">
                        {STRINGS.sub_patient} {index + 1}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSubPatient(sp.id);
                        }}
                        aria-label="remove-sub-patient"
                        size="small"
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0, boxShadow: 'none' }}>
                    <DisclosureSubPatientActionForm formRef={sp.ref} />
                  </AccordionDetails>
                </Accordion>
              ))}

              <Button startIcon={<Add />} onClick={handleAddSubPatient}>
                {STRINGS.add_sub_patient}
              </Button>
            </Stack>
          </>
        )}
        <ActionFab icon={<Save />} color="success" onClick={handleSave} />
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default BeneficiaryActionPage;
