import { Stack } from '@mui/material';
import DetailItemComponent from '@/core/components/common/detail-item/detail-item.component';
import ReusableCardComponent from '@/core/components/common/reusable-card/reusable-card.component';
import { Edit, LocationPin, Phone, PriorityHighOutlined, Work } from '@mui/icons-material';
import { formatDateTime } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
// import { blue } from '@mui/material/colors';
import type { TEmployee } from '../types/employee.types';
import CardAvatar from '@/core/components/common/reusable-card/card-avatar.component';
import { useNavigate } from 'react-router-dom';
import PhoneActionsMenu from '@/core/components/common/phone-actions-menu/phone-actions-menu.component';

const EmployeeCard = ({
  employee,
  canEdit,
  // onEditClick,
}: {
  employee: TEmployee;
  canEdit?: boolean;
  // onEditClick?: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const headerContent = (
    <CardAvatar
      name={employee.name}
      actions={
        canEdit
          ? [{ icon: <Edit />, onClick: () => navigate(`/employees/action?employeeId=${employee.id}`) }]
          : undefined
      }
    />
  );

  const bodyContent = (
    <Stack gap={2}>
      <DetailItemComponent
        icon={<Work />}
        label={STRINGS.role}
        iconColorPreset="green"
        value={STRINGS[employee.role as keyof typeof STRINGS]}
      />

      <DetailItemComponent icon={<Phone />} label={STRINGS.phones} value={<PhoneActionsMenu phone={employee.phone} />} />

      <DetailItemComponent
        icon={<LocationPin />}
        label={STRINGS.area}
        iconColorPreset="deepPurple"
        value={employee.areas.map((a) => a.area.name).join(', ') || STRINGS.none}
      />

      <DetailItemComponent
        icon={<PriorityHighOutlined />}
        label={STRINGS.created_at}
        iconColorPreset="blue"
        value={formatDateTime(employee.createdAt)}
      />
    </Stack>
  );

  return (
    <ReusableCardComponent
      // headerBackground={`linear-gradient(to right, ${blue[800]}, ${blue[500]})`}
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={null}
    />
  );
};

export default EmployeeCard;
