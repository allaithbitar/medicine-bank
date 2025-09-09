import { List } from "@mui/material";
import type { ReactElement } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SideBarListItem from "./sidebar-list-item.component";
import BadgeIcon from "@mui/icons-material/Badge";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import SidebarExpandableItem from "./sidebar-expandable-list-item.component";
import {
  Business as BuildingOfficeIcon,
  Sync,
  ThumbsUpDown,
} from "@mui/icons-material";
import STRINGS from "@/core/constants/strings.constant";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";

type BaseItem = {
  label: string;
  icon: ReactElement;
  permissions: string[];
  isDisabled?: boolean;
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
  const items: IItem[] = [
    {
      label: STRINGS.home_page,
      icon: <HomeIcon />,
      href: "/",
      permissions: [],
    },
    {
      label: STRINGS.employees,
      href: "/employees",
      icon: <BadgeIcon />,
      permissions: [],
    },
    {
      label: STRINGS.beneficiaries,
      href: "/beneficiaries",
      icon: <SupervisedUserCircleIcon />,
      permissions: [],
    },
    {
      label: STRINGS.disclosures,
      href: "/disclosures",
      icon: <SupervisedUserCircleIcon />,
      permissions: [],
    },
    {
      label: STRINGS.cities,
      href: "/cities",
      icon: <BuildingOfficeIcon />,
      permissions: [],
    },
    {
      label: STRINGS.areas,
      href: "/work-areas",
      icon: <EditLocationAltIcon />,
      permissions: [],
    },
    {
      label: STRINGS.ratings,
      href: "/ratings",
      icon: <ThumbsUpDown />,
      permissions: [],
    },
    {
      label: STRINGS.priority_degrees,
      href: "/priority-degrees",
      icon: <CrisisAlertIcon />,
      permissions: [],
    },
    {
      label: STRINGS.sync,
      href: "/sync",
      icon: <Sync />,
      permissions: [],
    },
  ];
  return (
    <List>
      {items
        .filter((p) => !p.isDisabled)
        // .filter((i) => checkPermission(i.permissions))
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
            <SideBarListItem
              onClick={onClick}
              key={i.label}
              icon={i.icon}
              label={i.label}
              level={1}
              href={i.href}
            />
          ),
        )}
    </List>
  );
}

export default SideBarItems;
