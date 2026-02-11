import { useEffect, useRef } from 'react';
import employeesApi from '@/features/employees/api/employees.api';
import type { TAutocompleteItem } from '@/core/types/common.types';

type TUseScoutRecommendationProps = {
  beneficiaryId: string | null | undefined;
  currentScout: TAutocompleteItem | null;
  onRecommendationFound: (scout: TAutocompleteItem) => void;
};

const useScoutRecommendation = ({
  beneficiaryId,
  currentScout,
  onRecommendationFound,
}: TUseScoutRecommendationProps) => {
  const [getRecommendations, { data: recommendations, isLoading }] =
    employeesApi.useLazyGetPatientScoutRecommendationsQuery();
  const appliedRecommendationForBeneficiaryRef = useRef<string | null>(null);

  useEffect(() => {
    if (appliedRecommendationForBeneficiaryRef.current !== beneficiaryId) {
      appliedRecommendationForBeneficiaryRef.current = null;
    }
    if (beneficiaryId && !currentScout && appliedRecommendationForBeneficiaryRef.current !== beneficiaryId) {
      getRecommendations({ patientId: beneficiaryId });
    }
  }, [beneficiaryId, currentScout, getRecommendations]);

  useEffect(() => {
    if (
      recommendations &&
      recommendations.length > 0 &&
      beneficiaryId &&
      appliedRecommendationForBeneficiaryRef.current !== beneficiaryId
    ) {
      onRecommendationFound(recommendations[0]);
      appliedRecommendationForBeneficiaryRef.current = beneficiaryId;
    }
  }, [recommendations, beneficiaryId, onRecommendationFound]);

  return {
    recommendations: recommendations ?? [],
    isLoading,
  };
};

export default useScoutRecommendation;
