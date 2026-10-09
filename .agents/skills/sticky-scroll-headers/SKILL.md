---
name: sticky-scroll-headers
description: Implement a header that scrolls away with its content and pins to the top of its scrollport, with a frosted stuck state. Use when a header must stay visible inside a scrolling column, when a sticky header does not move, does not release, never fires its stuck state, or when content scrolls beside a header instead of underneath it. Covers choosing the scroll owner, spacer techniques, and the two framework implementations in this repository.
license: MIT
metadata:
  author: dvibd
  version: "1.0.0"
---

# Sticky Scroll Headers

A header that travels with its content and pins to the top of its scrollport, then
adopts a frosted treatment once pinned. This skill documents the four working
implementations in this repository and the failure modes that produce each distinct
wrong behavior.

## The Contract

Every correct implementation satisfies all eight of these. Verify each one before
debugging further.

| # | Requirement | Consequence if missed |
| --- | --- | --- |
| 1 | The scrolling element is an **ancestor** of the header | Sticky never activates |
| 2 | Exactly one scroll container per column | Header splits the scroll or never moves |
| 3 | Header is `position: sticky; top: 0; z-index: 1` | Content renders over the header |
| 4 | Header is `flex-shrink: 0` inside a flex column | Header compresses under content |
| 5 | Initial offset comes from a spacer that scrolls away | Header starts flush to the edge, or cannot travel |
| 6 | Stuck test compares header against **its own scrollport** | State latches on or never fires |
| 7 | Scroll handler runs once on mount | Wrong state on first paint |
| 8 | Scroll listener is `{ passive: true }` and removed on cleanup | Jank, leaks |

The stuck treatment is identical in all four implementations:

```css
&.stuck {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  -webkit-backdrop-filter: blur(var(--blur));
  backdrop-filter: blur(var(--blur));
}
```

Keep the `-webkit-` prefix first. Both are required; Chrome and Safari need the prefix,
Firefox needs the unprefixed form.

## Choose the Scroll Owner First

Decide this before writing any CSS. It determines the stuck test and whether a spacer
is needed at all.

**Viewport scroller.** The window scrolls and the header sticks within the page flow.
Test with `header.getBoundingClientRect().top <= 0`. No spacer needed, because the
header's natural position is already part of the scrolling flow. This is
`social/src/components/(home)/FeedHeader.tsx`.

**Container scroller.** A panel scrolls inside itself. The header must be a child of
that panel, and the test must compare two rects because the panel's top edge is not
the viewport's. A spacer is needed if the panel is inset. This is all three columns in
`message/`.

Prefer the container scroller for multi column layouts, where each column scrolls
independently. Reach for the viewport scroller when the whole page moves as one.

## The Spacer Technique

When the scroll container is inset from the top edge, the header needs room to start
below that edge and then travel up to it. Requirements 5 exists because the obvious
approaches silently break sticky positioning.

A spacer is a `::before` pseudo element that occupies the gap and scrolls away:

```css
.scroller {
  height: 100%;
  padding-bottom: 2.5vh;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;

  &::before {
    content: "";
    display: block;
    flex: none;
    height: 2.5vh;
  }
}
```

Use `padding-bottom` for the trailing gap, not `padding-top`. A `padding-top` on the
scroll container creates a containing block whose top edge sits above the scrollport,
which **clamps the sticky header** so it can never travel past the padding. This is the
single most common cause of a header that appears stuck but does not move.

Never use a negative `top` on the header to escape the inset. It pins the header above
the viewport edge, where `overflow-x: hidden` clips it away.

## Failure Modes

### Header is a sibling of the scroller

The most common mistake. Sticky positions relative to its nearest scrolling **ancestor**,
not a sibling. A header next to a scrolling `<ul>` has no scrolling ancestor and never moves.

```html
<!-- broken: header has no scrolling ancestor -->
<section class="column">
  <header class="head" />
  <ul class="list" />   <!-- overflow-y: auto -->
</section>
```

```html
<!-- correct: the column itself scrolls, header is inside it -->
<section class="column">   <!-- overflow-y: auto -->
  <header class="head" />
  <ul class="list" />
</section>
```

### Two scroll containers

If the column scrolls **and** an inner container still has `overflow-y: auto`, the inner
one consumes the scroll and the header stays pinned by `flex-shrink: 0` with no travel.
It looks nearly correct, which makes it hard to spot.

```css
/* broken: inner container still scrolls */
.scroller { overflow-y: auto; }
.inner    { flex: 1; min-height: 0; overflow-y: auto; }

/* correct: inner containers are plain flow children */
.scroller { overflow-y: auto; }
.inner    { flex: none; }
```

A `textarea` that scrolls its own content is fine. Only scroll containers that were
*meant* to be the scroller must lose their overflow.

### Stuck state latches on permanently

The test compares against the wrong element. When the container ref points at an inner
container that sits **below** the header, `headerTop <= containerTop` is true from the
first frame and never becomes false.

```ts
/* broken: containerRef points at a sibling below the header */
setStuck(headerTop <= containerTop + 1);
```

The container ref must point at the element that actually scrolls, which is the header's
**ancestor**. Verify by grepping for the ref and confirming the two elements are in a
parent-child relationship.

### `gap` on the scroll container

`gap` on a flex column applies between **all** children, including the `::before` spacer.
That pushes the header down by the gap while sibling columns without a gap stay put, so
headers that should align do not.

```css
/* broken: gap inserts space between the spacer and the header */
.column { display: flex; gap: 1.5%; }

/* correct: spacing lives on the content below the header */
.list { margin-top: 1.5%; }
```

This one is easy to miss because it looks like a rounding difference rather than a layout
bug. When comparing headers across columns, diff the compiled CSS for stray `gap`.

## SolidJS Implementation

`social/src/components/(home)/FeedHeader.tsx`. Viewport scroller, so the test is a
single rect against zero. The initial `onScroll()` call sets correct first-paint state.

```tsx
const [stuck, setStuck] = createSignal(false);
let header!: HTMLElement;

onMount(() => {
  const onScroll = () => setStuck(header.getBoundingClientRect().top <= 0);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  onCleanup(() => window.removeEventListener("scroll", onScroll));
});
```

Build the class list from truthy tokens in a memo, so the attribute is omitted when clean:

```tsx
const headerClass = () =>
  [
    stuck() ? style.stuck : null,
    props.noBottomBorder ? style.noBottomBorder : null,
  ]
    .filter(Boolean)
    .join(" ");
```

The optional `ref` prop is a plain callback, not a signal ref. Assign it inside the same
ref callback that captures the local element.

## React Implementation

`message/src/hooks/useStuckScroll.ts`. Container scroller, so the test takes two refs
and compares header against scrollport.

```ts
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
```

The `+ 1` is a subpixel tolerance so the state does not flicker at the exact boundary.
The `resize` listener matters because the spacer is `vh`-based and changes with viewport
height.

Wire it up with both refs on ancestor and header, and pass `undefined` rather than an
empty string so the class attribute is omitted entirely:

```tsx
const rootRef = useRef<HTMLElement | null>(null);
const headerRef = useRef<HTMLElement | null>(null);
const stuck: boolean = useStuckScroll(rootRef, headerRef);
```

```tsx
<section id={style.current} ref={rootRef}>
  <header
    id={style.conversationHeader}
    ref={headerRef}
    className={stuck ? style.stuck : undefined}
  >
```

## Multi Column Checklist

When applying this to sibling columns that must align and behave identically:

1. Copy the **scroll container** block verbatim across columns. Only the inner content
   differs.
2. Keep `::before` spacer height, `padding-bottom`, `overflow-x`, `overflow-y`, and
   `box-sizing` identical everywhere.
3. Keep `position`, `top`, and `z-index` identical on every header. Only inner layout,
   padding, and radius may differ.
4. Run `grep -n "gap\|padding\|margin\|height" *.module.css` across the column modules
   and diff the results. A single differing value is the bug.
5. Confirm each header's element is a direct child of its scroller.
6. Confirm the sticky element has `position` set. A `position: absolute` close button
   inside a header needs `position: relative` on the header to anchor to it. Note that
   `position: sticky` already establishes a containing block, so this is only a problem
   if the header is not sticky.

## Repository Usage

| App | Implementation | Scroll owner |
| --- | --- | --- |
| `social` | `components/(home)/FeedHeader.tsx` | Viewport |
| `message` | `hooks/useStuckScroll.ts` | Each column |

`message` columns: `section#conversations`, `section#current`, `aside#information`.
Each has a `2.5vh` `::before` spacer and a sticky header or profile card.

Do not apply this skill to `dvibd/gui` without reading its layout first. It is SolidJS
like `social`, but its pages are single scroll regions with no independent columns.