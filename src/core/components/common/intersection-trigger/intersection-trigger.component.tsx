import { useIntersectionObserver } from "@/core/hooks/use-intersection-observer.hook";
import { useEffect } from "react";

const IntersectionTrigger = ({ onIntersect }: { onIntersect?: () => void }) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isIntersecting) {
      timeout = setTimeout(() => onIntersect?.(), 0);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);

  return <div ref={ref} style={{ height: 100 }} />;
};

export default IntersectionTrigger;
