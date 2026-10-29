import { onCleanup } from "solid-js";
import style from "../../styles/directives/reveal.module.css";

export type RevealOrder = 0 | 1 | 2 | 3 | 4;

const ORDER_CLASSES: Record<Exclude<RevealOrder, 0>, string> = {
  1: style.order1,
  2: style.order2,
  3: style.order3,
  4: style.order4,
};

const FALLBACK_DELAY: number = 2000;

function runOnce(el: Element, enter: () => void): void {
  if (typeof IntersectionObserver === "undefined") {
    enter();
    return;
  }

  const observer: IntersectionObserver = new IntersectionObserver(
    (
      entries: IntersectionObserverEntry[],
      instance: IntersectionObserver,
    ): void => {
      entries.forEach((entry: IntersectionObserverEntry): void => {
        if (entry.isIntersecting) {
          enter();
          instance.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0% 0% -6% 0%", threshold: 0.08 },
  );

  observer.observe(el);

  const onScreenAtMount: boolean =
    el.getBoundingClientRect().top < window.innerHeight;
  const fallback: number = onScreenAtMount
    ? window.setTimeout(enter, FALLBACK_DELAY)
    : 0;

  onCleanup((): void => {
    observer.disconnect();
    if (fallback !== 0) {
      window.clearTimeout(fallback);
    }
  });
}

export function staggerOrder(
  index: number,
  steps: 1 | 2 | 3 | 4 = 4,
): RevealOrder {
  const slot: number = index % steps;
  if (slot <= 0) {
    return 0;
  }
  if (slot === 1) {
    return 1;
  }
  if (slot === 2) {
    return 2;
  }
  if (slot === 3) {
    return 3;
  }
  return 4;
}

export function reveal(order: RevealOrder = 0): (el: Element) => void {
  return (el: Element): void => {
    if (order !== 0) {
      el.classList.add(ORDER_CLASSES[order]);
    }
    el.classList.add(style.revealOut);
    runOnce(el, (): void => {
      el.classList.remove(style.revealOut);
      el.classList.add(style.revealIn);
    });
  };
}

export function shutter(): (el: Element) => void {
  return (el: Element): void => {
    el.setAttribute("data-shutter", "out");
    runOnce(el, (): void => {
      el.setAttribute("data-shutter", "in");
    });
  };
}
