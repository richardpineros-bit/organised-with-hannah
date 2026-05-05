import { useEffect, useState, useRef, useCallback } from 'react';

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>('');
  const lastActiveRef = useRef<string>('');
  const observersRef = useRef<IntersectionObserver[]>([]);

  const cleanup = useCallback(() => {
    observersRef.current.forEach((obs) => obs.disconnect());
    observersRef.current = [];
  }, []);

  useEffect(() => {
    cleanup();

    const setupTimer = setTimeout(() => {
      const visibleSections = new Map<string, number>();

      const updateActive = () => {
        if (visibleSections.size === 0) {
          // When no section is visible, keep the LAST active section
          // (prevents jumping back to "Home" when scrolling past content)
          setActiveSection(lastActiveRef.current);
          return;
        }
        // Pick the section with the highest intersection ratio (most visible)
        let bestId = '';
        let bestRatio = -1;
        visibleSections.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        lastActiveRef.current = bestId;
        setActiveSection(bestId);
      };

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                visibleSections.set(id, entry.intersectionRatio);
              } else {
                visibleSections.delete(id);
              }
              updateActive();
            });
          },
          {
            rootMargin: `-${offset}px 0px -20% 0px`,
            threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
          }
        );

        observer.observe(el);
        observersRef.current.push(observer);
      });
    }, 500);

    return () => {
      clearTimeout(setupTimer);
      cleanup();
    };
  }, [sectionIds, offset, cleanup]);

  return activeSection;
}
