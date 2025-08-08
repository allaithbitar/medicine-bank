import type { TDisclosure } from "../types/disclosure.types";
import DisclosureActionForm from "./disclosure-action-form.component";

const DisclosureActionPage = ({
  disclosureData,
}: {
  disclosureData?: TDisclosure;
}) => {
  return <DisclosureActionForm disclosureData={disclosureData} />;
};

export default DisclosureActionPage;
