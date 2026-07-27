# How the sticky feed header works

The feed header in social pages (Feed, Notifications, Explore, Profile) is a standalone glass card that sticks to the top of the viewport when you scroll down. Here is how it works, piece by piece.

---

## The layout

Each page is a flex column inside a centered `max-width: 640px` container:

```
.page
  .sentinel    (1px invisible div)
  .header      (the glass card that sticks)
  ...content...
```

The `.page` element itself does **not** have `overflow` set — the scrolling happens on `<body>` / the document root.

---

## CSS sticky positioning

```css
.header {
  position: sticky;
  top: 0;
  z-index: 1;
}
```

`position: sticky` makes the element scroll normally with the page until its top edge reaches `top: 0` (the top of the viewport). At that point it "sticks" and stays fixed at the top while the rest of the page scrolls underneath.

Because the scrolling ancestor is the document root (no `overflow: scroll` on any intermediate parent), `sticky` is measured against the entire viewport.

## Why `top: 0` and not `top: 1.5rem`

The header sits flush at `top: 0`. If it started at `top: 1.5rem`, there would be a gap above it when stuck — content would peek through that gap as you scroll, which looks broken. `top: 0` ensures a clean hard stop at the viewport edge.

---

## The sentinel + IntersectionObserver

A 1px tall `<div class="sentinel">` is placed immediately before the header in the DOM:

```css
.sentinel {
  height: 1px;
  flex-shrink: 0;
}
```

This div is tracked by an `IntersectionObserver`:

```tsx
let sentinel!: HTMLDivElement;

onMount(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsStuck(!entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(sentinel);
  return () => observer.disconnect();
});
```

### How it works

The sentinel sits right above the header. As the user scrolls down:

1. **Before sticking:** The sentinel is visible in the viewport → `entry.isIntersecting === true` → `isStuck === false`.

2. **The moment the header hits the top:** The sentinel has scrolled past the top edge of the viewport → `entry.isIntersecting === false` → `isStuck === true`.

3. **Scroll back up:** The sentinel re-enters the viewport → `isStuck === false` again.

The `threshold: 0` means *any* overlap counts. As soon as even a single pixel of the sentinel goes out of view, it fires.

---

## The `.stuck` class — border-radius removal

When the header is stuck, its top border-radius looks awkward against the hard browser chrome edge. The signal drives a conditional CSS class:

```tsx
<div class={styles.header} classList={{ [styles.stuck]: isStuck() }}>
```

```css
.stuck {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
```

This flattens the top corners while stuck, and restores them the moment the header scrolls back into its normal position.

---

## Full lifecycle summary

| Scroll position | Sentinel visible? | `isStuck` | Header state |
|---|---|---|---|
| At the top | Yes | `false` | Normal (rounded corners) |
| Scrolling down, header approaching top | Yes | `false` | Normal (rounded corners) |
| Header hits top, sentinel out of view | No | `true` | Stuck (flat top corners) |
| Scrolling back up | No → Yes | `true → false` | Transitions back to normal |

All of this is calculated reactively in Solid — `isStuck` is a signal, so the `classList` binding re-evaluates automatically whenever the observer fires.

---

## Why this pattern matters

Without the sentinel, there is no pure-CSS way to know when a sticky element is actually "stuck." CSS `:stuck` was proposed but never shipped. The sentinel + `IntersectionObserver` approach fills this gap with minimal DOM overhead (one 1px div) and zero scroll event listeners (which would be much more expensive).
