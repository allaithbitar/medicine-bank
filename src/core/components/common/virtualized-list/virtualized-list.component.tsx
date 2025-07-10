import {
  useVirtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual";
import { useRef, type ReactNode } from "react";

function VirtualizedList<T>({
  containerStyle,
  children,
  virtualizationOptions,
  items,
}: {
  containerStyle?: React.HtmlHTMLAttributes<HTMLDivElement>["style"];
  virtualizationOptions: Partial<VirtualizerOptions<Element, Element>>;
  children: (props: { index: number; item: T; size: number }) => ReactNode;
  items: T[];
}) {
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    gap: 10,
    count: items.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
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
    </div>
  );
}

export default VirtualizedList;
