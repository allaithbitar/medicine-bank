import type { ComponentProps } from "react";
import type ConfirmModal from "../modals/confirm/confirm.modal";
import type CityFormModal from "@/core/components/common/modals/manage-city/manage-city.modal";
import type WorkAreaFormModal from "../modals/manage-areas/manage-areas.modal";
import type DisclosureFiltersModal from "@/features/disclosures/components/disclosure-filters.modal";
import type RatingFormModal from "@/features/ratings/components/ratimg-form.modal";

export type TModalExtraProps = {
  // it will always be sent but just to stop the ts compiler from parking
  modalId?: number;
};

export const MODAL_NAMES = {
  CONFIRM_MODAL: "CONFIRM_MODAL",
  CITY_FORM_MODAL: "CITY_FORM_MODAL",
  WORK_AREA_FORM_MODAL: "WORK_AREA_FORM_MODAL",
  DISCLOSURE_FILTERS_MODAL: "DISCLOSURE_FILTERS_MODAL",
  RATING_FORM_MODAL: "RATING_FORM_MODAL",
} as const;

export type TOpenModalPayload =
  | {
      name: typeof MODAL_NAMES.CONFIRM_MODAL;
      props: ComponentProps<typeof ConfirmModal>;
    }
  | {
      name: typeof MODAL_NAMES.CITY_FORM_MODAL;
      props: ComponentProps<typeof CityFormModal>;
    }
  | {
      name: typeof MODAL_NAMES.WORK_AREA_FORM_MODAL;
      props: ComponentProps<typeof WorkAreaFormModal>;
    }
  | {
      name: typeof MODAL_NAMES.DISCLOSURE_FILTERS_MODAL;
      props: ComponentProps<typeof DisclosureFiltersModal>;
    }
  | {
      name: typeof MODAL_NAMES.RATING_FORM_MODAL;
      props: ComponentProps<typeof RatingFormModal>;
    };
