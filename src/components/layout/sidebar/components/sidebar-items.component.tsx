import { List } from "@mui/material";
import type { ReactElement } from "react";
import HomeIcon from "@mui/icons-material/Home";
import SideBarListItem from "./sidebar-list-item.component";
import BadgeIcon from "@mui/icons-material/Badge";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import SidebarExpandableItem from "./sidebar-expandable-list-item.component";

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
      label: "Home",
      icon: <HomeIcon />,
      href: "/",
      permissions: [],
    },
    {
      label: "EmployeeManagement",
      href: "/employee-management",
      icon: <BadgeIcon />,
      permissions: [],
    },
    {
      label: "BeneficiaryManagement",
      href: "/beneficiary-management",
      icon: <SupervisedUserCircleIcon />,
      permissions: [],
    },
    {
      label: "banks",
      icon: <FeaturedPlayListIcon />,
      permissions: [],
      childrens: [
        {
          label: "Area",
          href: "/area-management",
          icon: <EditLocationAltIcon />,
          permissions: [],
        },
      ],
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
