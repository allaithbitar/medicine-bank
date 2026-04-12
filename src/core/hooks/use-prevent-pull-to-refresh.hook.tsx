import { useEffect, type PropsWithChildren } from 'react';

// Component that disables pull-to-refresh on mobile devices for its children.
// It uses two strategies:
// 1. CSS: overscroll-behavior to stop overscroll gestures in supporting browsers.
// 2. Touch handlers: preventDefault on touchmove when pulling down from the top
//    to handle browsers (like iOS Safari) that don't honor overscroll-behavior.
const PreventPullToRefresh = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    let startY = 0;
    let maybePrevent = false;

    function onTouchStart(e: TouchEvent) {
      if (!e.touches || e.touches.length !== 1) return;
      startY = e.touches[0].clientY;
      // Only consider preventing if the page is scrolled to the top
      maybePrevent = window.scrollY === 0;
    }

    function onTouchMove(e: TouchEvent) {
      if (!e.touches || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // If pulling down from the top, prevent the default pull-to-refresh.
      // Only call preventDefault when the event is cancelable; otherwise
      // browsers may log: "Ignored attempt to cancel a touchmove event with cancelable=false"
      if (maybePrevent && deltaY > 0) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Use overscroll-behavior to prevent refresh in supporting browsers.
  return <div style={{ overscrollBehavior: 'none' }}>{children}</div>;
};

export default PreventPullToRefresh;
