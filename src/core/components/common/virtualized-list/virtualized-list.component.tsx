import {
  useVirtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual";
import { useRef, type HtmlHTMLAttributes, type ReactNode } from "react";
import IntersectionTrigger from "../intersection-trigger/intersection-trigger.component";
import { CircularProgress, Stack } from "@mui/material";

function VirtualizedList<T>({
  containerStyle,
  children,
  virtualizationOptions,
  items,
  onEndReach,
  isLoading,
  disabledLastItemIntersectionObserver,
}: {
  containerStyle?: HtmlHTMLAttributes<HTMLDivElement>["style"];
  virtualizationOptions: Partial<VirtualizerOptions<Element, Element>>;
  children: (props: { index: number; item: T; size: number }) => ReactNode;
  items: T[];
  onEndReach?: () => void;
  isLoading?: boolean;
  disabledLastItemIntersectionObserver?: boolean;
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
    <div
      ref={parentRef}
      style={{
        height: "500px",
        overflow: "auto",
        ...containerStyle,
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer
          .getVirtualItems()
          ?.map(({ index, size, start, key }) => {
            const item = items[index];

            return (
              <div
                key={key}
                ref={rowVirtualizer.measureElement}
                data-index={index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${size}px`,
                  transform: `translateY(${start}px)`,
                }}
              >
                {children({ index, item, size })}
              </div>
            );
          })}
      </div>
      {!isLoading && !disabledLastItemIntersectionObserver && items.length && (
        <IntersectionTrigger onIntersect={onEndReach} />
      )}
      {isLoading && (
        <Stack alignItems="center" my={4}>
          <CircularProgress size={100} />
        </Stack>
      )}
    </div>
  );
}

export default VirtualizedList;
