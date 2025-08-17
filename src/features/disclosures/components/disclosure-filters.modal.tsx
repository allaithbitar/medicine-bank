import ModalWrapper from "@/core/components/common/modal/modal-wrapper.component";
import type { TGetDisclosuresDto } from "../types/disclosure.types";
import DisclosureFilters, {
  type TDisclosureFiltesHandlers,
} from "./disclosure-filters.component";
import { useRef } from "react";
import { Button, Stack } from "@mui/material";
import STRINGS from "@/core/constants/strings.constant";
import { useModal } from "@/core/components/common/modal/modal-provider.component";

const DisclosureFiltersModal = ({
  onSubmit,
}: {
  onSubmit: (
    values: Omit<TGetDisclosuresDto, "pageSize" | "pageNumber">,
  ) => void;
}) => {
  const { closeModal } = useModal();
  const filtersRef = useRef<TDisclosureFiltesHandlers | null>(null);
  return (
    <ModalWrapper
      actionButtons={
        <Button
          onClick={() => {
            closeModal();
            return onSubmit(filtersRef.current!.getValues());
          }}
        >
          {STRINGS.search}
        </Button>
      }
    >
      <Stack gap={2}>
        <DisclosureFilters ref={filtersRef} />
      </Stack>
    </ModalWrapper>
  );
};

export default DisclosureFiltersModal;
