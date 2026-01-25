import { useVirtualizer, type VirtualizerOptions } from '@tanstack/react-virtual';
import { useRef, type HtmlHTMLAttributes, type ReactNode } from 'react';
import IntersectionTrigger from '../intersection-trigger/intersection-trigger.component';
import { Card, CircularProgress, Stack, Typography } from '@mui/material';
import STRINGS from '@/core/constants/strings.constant';

function VirtualizedList<T>({
  containerStyle,
  children,
  virtualizationOptions,
  items,
  onEndReach,
  isLoading,
  disabledLastItemIntersectionObserver,
  totalCount,
}: {
  containerStyle?: HtmlHTMLAttributes<HTMLDivElement>['style'];
  virtualizationOptions: Partial<VirtualizerOptions<Element, Element>>;
  children: (props: { index: number; item: T; size: number }) => ReactNode;
  items: T[];
  onEndReach?: () => void;
  isLoading?: boolean;
  disabledLastItemIntersectionObserver?: boolean;
  totalCount?: number;
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    gap: 10,
    count: items.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
    measureElement: (element) => {
      return element.firstElementChild?.getBoundingClientRect().height;
    },
    ...(virtualizationOptions as any),
  });

  return (
    <Stack gap={1} sx={{ height: '100%', overflow: 'auto' }}>
      {typeof totalCount !== 'undefined' && (
        <Card sx={{ p: 1 }}>
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Typography textAlign="center" fontSize={16} color="primary">
              {totalCount} {STRINGS.result_count}
            </Typography>
          </Stack>
        </Card>
      )}
      <div
        ref={parentRef}
        style={{
          overflow: 'auto',
          ...containerStyle,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems()?.map(({ index, size, start, key }) => {
            const item = items[index];

            return (
              <div
                key={key}
                ref={rowVirtualizer.measureElement}
                data-index={index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${size}px`,
                  transform: `translateY(${start}px)`,
                }}
              >
                {children({ index, item, size })}
              </div>
            );
          })}
        </div>
        {!isLoading && !disabledLastItemIntersectionObserver && !!items.length && (
          <IntersectionTrigger onIntersect={onEndReach} />
        )}
        {isLoading && (
          <Stack alignItems="center" my={4}>
            <CircularProgress size={100} />
          </Stack>
        )}
      </div>
    </Stack>
  );
}

export default VirtualizedList;
