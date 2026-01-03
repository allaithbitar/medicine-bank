import { Typography, useTheme } from '@mui/material';
import { useMemo, type ComponentProps, type ReactNode } from 'react';

const CustomBadge = ({
  colors,
  children,
  sx,
  outlined,
  ...rest
}: ComponentProps<typeof Typography> & {
  colors?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'grey';
  children: ReactNode;
  outlined?: boolean;
}) => {
  const theme = useTheme();
  const styles = useMemo(() => {
    const _defaultStyles = {
      px: 1,
      py: 0.5,
      borderRadius: `${theme.shape.borderRadius}px`,
      ...(outlined && {
        borderWidth: 1,
        borderStyle: 'solid',
      }),
      ...sx,
    };
    if (colors) {
      if (colors === 'grey')
        return {
          [outlined ? 'boredeColor' : 'bgcolor']: theme.palette.action.disabledBackground,
          color: theme.palette.action.active,
          ..._defaultStyles,
        };

      return {
        [outlined ? 'borderColor' : 'bgcolor']: theme.palette[colors].main,
        color: theme.palette[colors][outlined ? 'main' : 'contrastText'],
        ..._defaultStyles,
      };
    }

    return _defaultStyles;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  return (
    <Typography variant="subtitle2" sx={styles} {...rest}>
      {children}
    </Typography>
  );
};

export default CustomBadge;
