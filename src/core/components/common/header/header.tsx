import type { Theme } from '@emotion/react';
import { Card, Typography, type SxProps, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import CustomIconButton from '../custom-icon-button/custom-icon-button.component';

interface HeaderProps {
  title: string;
  sx?: SxProps<Theme>;
  showBackButton?: boolean;
  onBack?: () => void;
}

function Header({ title, sx, showBackButton = false, onBack }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Card sx={{ width: '100%', p: 1, bgcolor: (theme) => theme.palette.grey[100], mb: 1, ...sx }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        {showBackButton && (
          <CustomIconButton
            sx={{ color: (theme) => theme.palette.primary.main, background: (theme) => theme.palette.background.paper }}
            onClick={handleBack}
            size="small"
            aria-label="back"
          >
            <ArrowForwardIcon />
          </CustomIconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

export default Header;
