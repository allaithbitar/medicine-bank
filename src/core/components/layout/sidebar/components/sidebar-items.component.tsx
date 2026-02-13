import { List } from '@mui/material';
import type { ReactElement } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import SideBarListItem from './sidebar-list-item.component';
import BadgeIcon from '@mui/icons-material/Badge';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import SidebarExpandableItem from './sidebar-expandable-list-item.component';
import { Business as BuildingOfficeIcon, Sync, ThumbsUpDown, Payment } from '@mui/icons-material';
import STRINGS from '@/core/constants/strings.constant';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import usePermissions from '@/core/hooks/use-permissions.hook';

type BaseItem = {
  label: string;
  icon: ReactElement;
};

type LinkItem = BaseItem & {
  href: string;
  childrens?: never;
};

type ParentItem = BaseItem & {
  href?: never;
  childrens: IItem[];
};
export type IItem = LinkItem | ParentItem;

function SideBarItems({ onClick }: { onClick: () => void }) {
  const { hasRouteAccess, currentUserRole } = usePermissions();

  const items: IItem[] = [
    {
      label: STRINGS.home_page,
      icon: <HomeIcon />,
      href: '/',
    },
    {
      label: STRINGS.disclosure_consulting,
      href: '/adviser_disclosure_consultations',
      icon: <PsychologyAltIcon />,
    },
    {
      label: currentUserRole === 'scout' ? STRINGS.employee : STRINGS.employees,
      href: '/employees',
      icon: <BadgeIcon />,
    },
    {
      label: STRINGS.beneficiaries,
      href: '/beneficiaries',
      icon: <SupervisedUserCircleIcon />,
    },
    {
      label: STRINGS.disclosures,
      href: '/disclosures',
      icon: <SupervisedUserCircleIcon />,
    },
    {
      label: STRINGS.cities,
      href: '/cities',
      icon: <BuildingOfficeIcon />,
    },
    {
      label: STRINGS.areas,
      href: '/work-areas',
      icon: <EditLocationAltIcon />,
    },
    {
      label: STRINGS.ratings,
      href: '/ratings',
      icon: <ThumbsUpDown />,
    },
    {
      label: STRINGS.medicines,
      href: '/medicines',
      icon: <MedicalServicesIcon />,
    },
    {
      label: STRINGS.meetings,
      href: '/meetings',
      icon: <MeetingRoomOutlinedIcon />,
    },
    {
      label: STRINGS.priority_degrees,
      href: '/priority-degrees',
      icon: <CrisisAlertIcon />,
    },
    {
      label: STRINGS.calendar,
      href: '/calendar',
      icon: <CalendarMonthIcon />,
    },
    {
      label: STRINGS.payments,
      href: '/payments',
      icon: <Payment />,
    },
    {
      label: STRINGS.the_sync,
      href: '/sync',
      icon: <Sync />,
    },
  ];
  return (
    <List sx={{ height: '100%', overflow: 'auto' }}>
      {items
        .filter((i) => i.href && hasRouteAccess(i.href))
        .map((i) =>
          i.childrens ? (
            <SidebarExpandableItem
              onClick={onClick}
              key={i.label}
              label={i.label}
              childrens={i.childrens}
              level={1}
              icon={i.icon}
            />
          ) : (
            <SideBarListItem onClick={onClick} key={i.label} icon={i.icon} label={i.label} level={1} href={i.href} />
          )
        )}
    </List>
  );
}

export default SideBarItems;
