import { IconButton, Stack } from '@mui/material';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { MdMenuOpen } from 'react-icons/md';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import { Link } from 'react-router-dom';
import { Download } from '@mui/icons-material';

// BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function Navbar({
  setOpenSidebar,
  openSidebar,
}: {
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  openSidebar: boolean;
}) {
  // State to store the install prompt event
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  // State to track if the app is installed
  const [isInstalled, setIsInstalled] = useState(false);
  console.log({ installEvent, isInstalled });

  useEffect(() => {
    // Handler for the beforeinstallprompt event
    function handleInstall(event: Event) {
      // Prevent the default mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    // Handler for when the app is successfully installed
    function handleAppInstalled() {
      // Clear the install event
      setInstallEvent(null);
      // Mark as installed
      setIsInstalled(true);
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handler for install button click
  const handleInstallClick = async () => {
    if (!installEvent) {
      return;
    }

    // Show the install prompt
    await installEvent.prompt();

    // Wait for the user to respond to the prompt
    const result = await installEvent.userChoice;

    // If the user accepted, mark as installed
    if (result.outcome === 'accepted') {
      setInstallEvent(null);
      setIsInstalled(true);
    }
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', p: 1, px: 2 }}>
      <IconButton
        color="primary"
        onClick={() => setOpenSidebar((prev: any) => !prev)}
        sx={{ scale: `${!openSidebar && '-'}1 !important` }}
      >
        <MdMenuOpen />
      </IconButton>
      <Stack sx={{ gap: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Link to={`/system-broadcast`} style={{ marginInlineStart: 'auto' }}>
          <IconButton color="primary">
            <RecordVoiceOverOutlinedIcon />
          </IconButton>
        </Link>
        {/* Install button - only shown when app is installable and not yet installed */}
        {installEvent && !isInstalled && (
          <IconButton color="info" onClick={handleInstallClick} title="Install App">
            <Download />
          </IconButton>
        )}
        <img src={`/logo.jpeg`} style={{ width: 50, borderRadius: '8px' }} alt="bank-logo" />
      </Stack>
    </Stack>
  );
}

export default Navbar;
