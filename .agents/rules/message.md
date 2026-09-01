# `message` Project Rules

## GUI
1. Use a CSS Module and never CSS (except `globals.css` / `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
   - CSS Modules scope id selectors too, not just classes. Always bind the module as `style` and reference elements through it: `id={style.navBar}` for a selector written `nav#navBar`. Never use a raw `id="navBar"` for an element styled by a module (the hashed id will not match), and never import a module side-effect only (`import "./x.module.css"`) when its members could be used. Import it as `style` and use `style.xxx`, matching the `tag#xxx` selectors in the module.
2. Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (`>`) by default unless descendants are targeted by the style. For example: `div#app { ... }` and never `#app { ... }`.
3. Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
4. Every time you make a component or a page, its most ancestor element should be an HTML container semantic tag that best represents its content. If none can be chosen out of the semantic HTML container elements, `<div>` may be used.
5. Ids and classes of elements should be in camelCase from its component/page's corresponding CSS Module.
6. Always `%` for sizing, dimension, or spacing units so that it is proportional to its parent element. You can only use `rem` for font-sizes and media-query breakpoints. Except for `border-radius`, in which you are allowed to use `px`.
7. Never use `<>`/`</>` or React/Solid `<Fragment>`.
8. You do not have to run `npm run build` to check if it builds correctly during active development.
9. Do not put the title in the logo when designing unless explicitly told.
10. GUI codespace follows ReactJS/NextJS (and/or SolidStart) idioms.
11. Mirroring: `src/routes/` (or `app/`) and `src/styles/` mirror each other: pages and components have a parallel CSS Module in the same relative path.

## API
1. Every time you write an endpoint, above it should be the URL preceded with the request verb. For example: `POST /conversations`.
2. API code writing is idiomatic to the framework (e.g. cookie management via framework utilities rather than localStorage).

## Coding
1. If text is to be enclosed in quotes, you must use double quotes (`"`).
2. The `message` app runs on Node. Type-check with `npx tsc --noEmit`.
3. Write fully-typed TypeScript and TypeScriptXML code. No variable declared or initialized without an explicit type. No function without an explicit return type.

## Writing
1. Refrain from using the em dash.

## Architecture & Layout
- The Message app is a separate app within the `dvibd` workspace. It is distinct from `social`; `social` left nav intentionally omits messages because messaging lives here.
- It shares `orm/` (Prisma schema, generated client) and `db/` (Postgres) with the other apps in the project. It does not define its own schema.
- Follow the same self-contained backend pattern as `social` where applicable: auth HTTP routes live directly under `src/routes/(auth)/` (or Next.js API routes) with no `/api` prefix; page files stay client-safe, and server-only modules (`bcrypt`, `prisma`, `pg`, `h3`) must never be imported into a file with a default page component.
- Sizing conversions use viewport reference percentage calibration. Forbidden to use px except for border-radius.
