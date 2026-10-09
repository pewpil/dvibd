import { useEffect, useState, type RefObject } from "react";

export function useStuckScroll(
  containerRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLElement | null>,
): boolean {
  const [stuck, setStuck] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const container: HTMLElement | null = containerRef.current;
    const header: HTMLElement | null = headerRef.current;
    if (container === null || header === null) {
      return (): void => {};
    }

    const handleScroll = (): void => {
      const containerTop: number = container.getBoundingClientRect().top;
      const headerTop: number = header.getBoundingClientRect().top;
      setStuck(headerTop <= containerTop + 1);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return (): void => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [containerRef, headerRef]);

  return stuck;
}