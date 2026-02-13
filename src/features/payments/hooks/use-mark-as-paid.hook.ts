import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifyError, notifySuccess } from '@/core/components/common/toast/toast';
import STRINGS from '@/core/constants/strings.constant';
import paymentsApi from '../api/payments.api';

type TMarkAsPaidParams = {
  scoutId: string;
  dateFrom?: string;
  dateTo?: string;
};

const useMarkAsPaid = () => {
  const { openModal } = useModal();
  const [markAsPaidMutation, { isLoading }] = paymentsApi.useMarkAsPaidMutation();
  const markAsPaid = (params: TMarkAsPaidParams) => {
    const { scoutId, dateFrom, dateTo } = params;
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        title: STRINGS.mark_as_paid,
        message: STRINGS.mark_as_paid_confirmation,
        description: dateFrom || dateTo ? undefined : STRINGS.all_from_last_paid,
        onConfirm: async () => {
          try {
            await markAsPaidMutation({
              scoutId,
              dateFrom: dateFrom || undefined,
              dateTo: dateTo || undefined,
            }).unwrap();
            notifySuccess(STRINGS.action_done_successfully);
          } catch (err: any) {
            notifyError(err);
          }
        },
      },
    });
  };
  return {
    markAsPaid,
    isMarking: isLoading,
  };
};

export default useMarkAsPaid;
