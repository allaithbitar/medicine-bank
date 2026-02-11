import type { ComponentProps } from 'react';
import type ConfirmModal from '../modals/confirm/confirm.modal';
import type BeneficiariesFiltersModal from '@/features/beneficiaries/components/beneficiaries-filters.modal';
import type DisclosureFiltersModal from '@/features/disclosures/components/disclosure-filters.modal';
import type ChangePasswordModal from '@/features/auth/components/change-password.modal';
import type MoveDisclosuresModal from '@/features/disclosures/components/move-disclosures.modal';

export type TModalExtraProps = {
  // it will always be sent but just to stop the ts compiler from parking
  modalId?: number;
};

export const MODAL_NAMES = {
  CONFIRM_MODAL: 'CONFIRM_MODAL',
  BENEFICIARIES_FILTERS_MODAL: 'BENEFICIARIES_FILTERS_MODAL',
  DISCLOSURE_FILTERS_MODAL: 'DISCLOSURE_FILTERS_MODAL',
  CHANGE_PASSWORD_MODAL: 'CHANGE_PASSWORD_MODAL',
  MOVE_DISCLOSURES_MODAL: 'MOVE_DISCLOSURES_MODAL',
} as const;

export type TOpenModalPayload =
  | {
      name: typeof MODAL_NAMES.CONFIRM_MODAL;
      props: ComponentProps<typeof ConfirmModal>;
    }
  | {
      name: typeof MODAL_NAMES.BENEFICIARIES_FILTERS_MODAL;
      props: ComponentProps<typeof BeneficiariesFiltersModal>;
    }
  | {
      name: typeof MODAL_NAMES.DISCLOSURE_FILTERS_MODAL;
      props: ComponentProps<typeof DisclosureFiltersModal>;
    }
  | {
      name: typeof MODAL_NAMES.CHANGE_PASSWORD_MODAL;
      props?: ComponentProps<typeof ChangePasswordModal>;
    }
  | {
      name: typeof MODAL_NAMES.MOVE_DISCLOSURES_MODAL;
      props: ComponentProps<typeof MoveDisclosuresModal>;
    };
