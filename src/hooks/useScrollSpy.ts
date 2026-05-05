import { useEffect, useState, useRef, useCallback } from 'react';

export function useScrollSpy(sectionIds: string[], offset: number = 0) {
  const [activeSection, setActiveSection] = useState<string>('');
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
        if (visibleSections.size === 0) { setActiveSection(''); return; }
        let bestId = ''; let bestRatio = -1;
        visibleSections.forEach((ratio, id) => { if (ratio > bestRatio) { bestRatio = ratio; bestId = id; } });
        setActiveSection(bestId);
      };
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) visibleSections.set(id, entry.intersectionRatio);
              else visibleSections.delete(id);
              updateActive();
            });
          },
          { rootMargin: `-${offset}px 0px -40% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] }
        );
        observer.observe(el);
        observersRef.current.push(observer);
      });
    }, 500);
    return () => { clearTimeout(setupTimer); cleanup(); };
  }, [sectionIds, offset, cleanup]);

  return activeSection;
}
