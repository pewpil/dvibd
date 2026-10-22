import type { Attachment } from "svelte/attachments";

export function stuckHeader(
  setStuck: (value: boolean) => void,
  onScroll?: (scrollTop: number) => void,
  restore?: () => number,
): Attachment<HTMLElement> {
  return (header: HTMLElement): (() => void) => {
    const scroller: HTMLElement | null = header.parentElement;
    if (scroller === null) {
      return () => {};
    }
    const test = (): void => {
      setStuck(
        header.getBoundingClientRect().top <=
          scroller.getBoundingClientRect().top + 1,
      );
      onScroll?.(scroller.scrollTop);
    };
    if (restore !== undefined) {
      scroller.scrollTop = restore();
    }
    test();
    scroller.addEventListener("scroll", test, { passive: true });
    window.addEventListener("resize", test);
    return () => {
      scroller.removeEventListener("scroll", test);
      window.removeEventListener("resize", test);
    };
  };
}
