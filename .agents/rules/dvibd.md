# `dvibd` Project Rules

## GUI
1. Use a CSS Module and never CSS (except `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
2. Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (`>`) by default unless descendants are targeted by the style. For example: `div#app { ... }` and never `#app { ... }`.
3. Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
4. Every time you make a component or a page, its most ancestor element should be an HTML container semantic tag that best represents its content. If none can be chosen out of the semantic HTML container elements, `<div>` may be used.
5. Ids and classes of elements should be in camelCase from its component/page's corresponding CSS Module.
6. Always `%` for sizing, dimension, or spacing units so that it is proportional to its parent element. You can only use `rem` for font-sizes and media-query breakpoints. Except for `border-radius`, in which you are allowed to use `px`.
7. Never use `<>`/`</>` or SolidJS `<Fragment>`.
8. You do not have to run `npm run build` to check if it builds correctly because during development the user actively monitors development mode.
9. Do not put the title in the logo when designing unless explicitly told.
10. GUI codespace has to be completely SolidJS and SolidStart idiomatic. For example, use SolidJS `<Show>` instead of TSX `&&` or `||` for conditional rendering of elements.

## API
1. When writing TypeScript code, take note of the `compilerOptions`, `fmt`, and `lint` in the project's `deno.json` file.
2. Every time you write an endpoint, above it should be the URL preceded with the request verb. For example: `POST /auth/signup`.

## Coding
1. If text is to be enclosed in quotes, you must use double quotes (`"`).
2. The runtime of `dvibd/api` is Deno. Respect `deno check src/`.

## Writing
1. Refrain from using the em dash.

## Styling & Architecture Specifics
- CSS Modules (Lightning CSS in Vite) scope id selectors too, not just classes. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use a raw `id="navBar"` for an element styled by a module (the hashed id will not match), and never import a module side-effect only (`import "./x.module.css"`) when its members could be used. Import it as `style` and use `style.xxx`, matching the `tag#xxx` selectors in the module.
- Since ids are scoped by modules, `:global(...)` is still required for global selectors like the router's `.active` class on links: `&:global(.active)`.
- `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` <-> `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` <-> `styles/pages/dvibd/home/Landing.module.css`), with `uis/index.tsx` <-> `styles/index.css`.
- When converting px to %, the user's browser viewport is the reference so it cascades to descendants (percentage sizing is relative to parent). Calibrate the % so the value corresponds to the px size relative to the viewport: e.g. 120px -> 8.3% of ~1440px viewport, 64px -> 8.4% of ~760px mobile viewport, 24px -> 1.7%, 48px -> 3.3%, 40px -> 2.8%, 56px -> 3.9%, `--space` 24px -> 1.7% (widened to 6% so page content does not hug viewport edges), `--width` 1100px -> 76.5%, fixed toggle top 16px -> 1.8% of viewport height. Media-query breakpoints (e.g. 760px) are okay as rem (47.5rem). Gaps/borders/shadows/blur retain rem; font-sizes use rem; border-radius uses px.
- Forbidden to use px except for border-radius.
