# Project Memory
## gui
- You should use a CSS Module and never CSS (except `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
- Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (>) by default unless decendants are targeted by the style. For example: div#app { ... } and never #app { ... }. 
- Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
- Everyime you make a component or a page, its most ancestor element should be a HTML container semantic tag that best represent its content. If none can be chosen out of the semantic html container elements, <div> may be used.
- id's and classes of elements should be in camel case from its component/page's corresponding CSS Module.
- Never use px as a unit for anything. Use % so that it's proportional to its parent element. You must use rem for font-sizes.
- Never use <>/</> or solidjs' <Framgment>


## AI Appended
- CSS Modules (Lightning CSS in Vite) scope id selectors too, not just classes. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use a raw `id="navBar"` for an element styled by a module (the hashed id won't match), and never import a module side-effect only (`import './x.module.css'`) when its members could be used — import it as `style` and use `style.xxx`, matching the `tag#xxx` selectors in the module.
- Since ids are scoped by modules, `:global(...)` is still required for global selectors like the router's `.active` class on links: `&:global(.active)`.
- `src/uis/` and `src/styles/` mirror each other: every component and page under `uis/` has a parallel CSS Module under `styles/` in the same relative path (e.g. `uis/components/dvibd/home/NavBar.tsx` ↔ `styles/components/dvibd/home/NavBar.module.css`, `uis/pages/dvibd/home/Landing.tsx` ↔ `styles/pages/dvibd/home/Landing.module.css`), with `uis/index.tsx` ↔ `styles/index.css`.
