import { Button, Drawer, Stack } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import SideBarItems from './components/sidebar-items.component';
import { authActions } from '@/core/slices/auth/auth.slice';
import STRINGS from '@/core/constants/strings.constant';
import { useAppDispatch } from '@/core/store/root.store.types';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { MODAL_NAMES } from '@/core/components/common/modal/modal-types';

const drawerWidth = 300;

function Sidebar({
  openSidebar,
  setOpenSidebar,
}: {
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  return (
    <Drawer
      onClose={() => setOpenSidebar(false)}
      sx={{
        width: openSidebar ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          // marginTop: "64px",
          width: drawerWidth,
          boxSizing: 'border-box',
          p: 2,
          border: 'none',
          height: '100dvh',
          overflowY: 'auto',
        },
      }}
      anchor="left"
      variant="temporary"
      open={openSidebar}
    >
      <Stack sx={{ height: '100%' }}>
        <Stack
          sx={{
            width: '100%',
            height: 125,
            alignItems: 'center',
          }}
        >
          {openSidebar && (
            <img src={'/logo.jpeg'} style={{ width: 100, marginBottom: 10, borderRadius: 8 }} alt="app-logo" />
          )}

          {/* <IconButton
            disableRipple
            onClick={() => setOpenSidebar((prev) => !prev)}
            sx={{
              color: (theme) => theme.palette.primary.main,
              flex: 1,
              ...(!openSidebar ? { transform: 'scaleX(-1)' } : { position: 'absolute', top: 5, right: 5, zIndex: 10 }),
            }}
          >
            <SvgIcon />
          </IconButton> */}
        </Stack>
        <SideBarItems onClick={() => setOpenSidebar(false)} />
        <Stack sx={{ flexDirection: 'row', gap: 1, flex: 1 }}>
          <Button
            fullWidth
            onClick={() => {
              dispatch(authActions.logoutUser());
              sessionStorage.clear();
            }}
          >
            {STRINGS.logout}
          </Button>
          <Button
            fullWidth
            onClick={() => {
              openModal({ name: MODAL_NAMES.CHANGE_PASSWORD_MODAL });
              setOpenSidebar(false);
            }}
          >
            {STRINGS.change_password}
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}

export default Sidebar;
