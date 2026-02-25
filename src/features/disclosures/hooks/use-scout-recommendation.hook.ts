import { useEffect, useRef } from 'react';
import employeesApi from '@/features/employees/api/employees.api';
import type { TAutocompleteItem } from '@/core/types/common.types';

type TUseScoutRecommendationProps = {
  beneficiaryId?: string | null | undefined;
  areaId?: string | null | undefined;
  onRecommendationFound: (scout: TAutocompleteItem) => void;
};

const useScoutRecommendation = ({ beneficiaryId, areaId, onRecommendationFound }: TUseScoutRecommendationProps) => {
  const [getRecommendations, { data: recommendations, isLoading }] =
    employeesApi.useLazyGetPatientScoutRecommendationsQuery();
  const appliedRecommendationForBeneficiaryRef = useRef<string | null>(null);
  const appliedRecommendationForAreaRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      appliedRecommendationForBeneficiaryRef.current !== beneficiaryId ||
      appliedRecommendationForAreaRef.current !== areaId
    ) {
      appliedRecommendationForBeneficiaryRef.current = null;
      appliedRecommendationForAreaRef.current = null;
    }

    const hasParameter = beneficiaryId || areaId;
    const alreadyApplied = appliedRecommendationForBeneficiaryRef.current === beneficiaryId;
    const shouldFetch = hasParameter && !alreadyApplied;

    if (shouldFetch) {
      getRecommendations({
        patientId: beneficiaryId || undefined,
        areaId: areaId || undefined,
      });
    }
  }, [beneficiaryId, areaId, getRecommendations]);

  useEffect(() => {
    if (recommendations && recommendations.length > 0 && (beneficiaryId || areaId)) {
      onRecommendationFound(recommendations[0]);
      appliedRecommendationForBeneficiaryRef.current = beneficiaryId || null;
      appliedRecommendationForAreaRef.current = areaId || null;
    }
  }, [recommendations, beneficiaryId, areaId, onRecommendationFound]);

  return {
    recommendations: recommendations ?? [],
    isLoading,
  };
};

export default useScoutRecommendation;
