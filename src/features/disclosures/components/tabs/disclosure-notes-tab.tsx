import DisclosureNotes from "@/features/disclosures/components/disclosure-notes.component";
import type { TDisclosure } from "@/features/disclosures/types/disclosure.types";

const DisclosureNotesTab = ({
  disclosureId,
}: {
  disclosureId?: string;
  disclosure?: TDisclosure;
  openEditExtra?: (s: any) => void;
  handleOpenBeneficiaryMedicineActionPage?: (bm?: any) => void;
  handleOpenFamilyMembersActionPage?: (m?: any) => void;
  openNoteAction?: () => void;
}) => {
  return <DisclosureNotes disclosureId={disclosureId} />;
};

export default DisclosureNotesTab;
