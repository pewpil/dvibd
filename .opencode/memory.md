# Project Memory
## gui Instructions
1. You should use a CSS Module and never CSS (except `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
2. Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (>) by default unless decendants are targeted by the style. For example: div#app { ... } and never #app { ... }. 
3. Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
4. Everyime you make a component or a page, its most ancestor element should be a HTML container semantic tag that best represent its content. If none can be chosen out of the semantic html container elements, <div> may be used.
5. id's and classes of elements should be in camel case from its component/page's corresponding CSS Module.
6. Always % for sizing, dimension or spacing units so that it's proportional to its parent element. You can only use rem but for font-sizes only. Except for the following in which you are allowed to use px: border-radius.
7. Never use <>/</> or solidjs' <Framgment>
8. You do not have to run `npm run build` to check if it builds correctly because as we develop the gui, I am actively looking at the development mode of the site. I will mention if anything is wrong.
9. You are not to put the title in the logo when designing unless you are explicityly being told.

## api
1. When writing typescript code. Take note of the compilerOptions, fmt and lint in the project's deno.json file.

## coding
1. If some text are to be enclosed of either double (") or single (") quotes. You must use double quotes.

## writing
1. Refrain from using the em dash.


## AI Appended
- CSS Modules (Lightning CSS in Vite) scope id selectors too, not just classes. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use a raw `id="navBar"` for an element styled by a module (the hashed id won't match), and never import a module side-effect only (`import './x.module.css'`) when its members could be used — import it as `style` and use `style.xxx`, matching the `tag#xxx` selectors in the module.
- Since ids are scoped by modules, `:global(...)` is still required for global selectors like the router's `.active` class on links: `&:global(.active)`.
- `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` ↔ `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` ↔ `styles/pages/dvibd/home/Landing.module.css`), with `uis/index.tsx` ↔ `styles/index.css`.
- When converting px to %, the user's browser viewport is the reference so it cascades to descendants (percentage sizing is relative to parent). Calibrate the % so the value corresponds to the px size relative to the viewport: e.g. 120px → 8.3% of ~1440px viewport, 64px → 8.4% of ~760px mobile viewport, 24px → 1.7%, 48px → 3.3%, 40px → 2.8%, 56px → 3.9%, --space 24px → 1.7% (user later widened to 6% so page content doesn't hug viewport edges), --width 1100px → 76.5%, fixed toggle top 16px → 1.8% of viewport height. Media-query breakpoints (e.g. 760px) are okay as rem (47.5rem). Gaps/borders/shadows/blur retain rem; font-sizes use rem; border-radius uses px.
    - This was when you are converting all values of properties that were initially in px. From now on, you are forbidden to use px except as explicityly stated from gui Instruction 6.
