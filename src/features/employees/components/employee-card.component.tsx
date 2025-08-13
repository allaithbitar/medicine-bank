import { Button, Stack } from "@mui/material";
import DetailItemComponent from "@/core/components/common/detail-item/detail-item.component";
import ReusableCardComponent from "@/core/components/common/reusable-card/reusable-card.component";
import {
  Edit,
  LocationPin,
  Phone,
  PriorityHighOutlined,
  Work,
} from "@mui/icons-material";
import { formatDateTime } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import { blue } from "@mui/material/colors";
import type { TEmployee } from "../types/employee.types";
import CardAvatar from "@/core/components/common/reusable-card/card-avatar.component";
import { Link } from "react-router-dom";

const EmployeeCard = ({
  employee,
  // onEditClick,
}: {
  employee: TEmployee;
  // onEditClick?: (id: string) => void;
}) => {
  const headerContent = <CardAvatar name={employee.name} />;

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<Work />}
        label={STRINGS.role}
        iconColorPreset="green"
        value={STRINGS[employee.role as keyof typeof STRINGS]}
      />

      <DetailItemComponent
        icon={<Phone />}
        label={STRINGS.phones}
        value={employee.phone}
      />

      <DetailItemComponent
        icon={<LocationPin />}
        label={STRINGS.area}
        iconColorPreset="deepPurple"
        value={employee.area?.name ?? STRINGS.none}
      />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.created_at}
        iconColorPreset="blue"
        value={formatDateTime(employee.createdAt)}
      />
    </Stack>
  );

  const footerContent = (
    <Link
      to={`/employees/action?employeeId=${employee.id}`}
      style={{ marginInlineStart: "auto" }}
    >
      <Button startIcon={<Edit />}>{STRINGS.edit}</Button>
    </Link>
  );

  return (
    <ReusableCardComponent
      headerBackground={`linear-gradient(to right, ${blue[800]}, ${blue[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={footerContent}
    />
  );
};

export default EmployeeCard;
