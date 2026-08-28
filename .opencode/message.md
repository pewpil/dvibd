# `message` App Notes

## gui

1. You should use a CSS Module and never CSS (except `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
2. Styling files should be written fully nested with its selector indicating the element's tag name and id/class with an immediate child selector (>) by default unless decendants are targeted by the style. For example: div#app { ... } and never #app { ... }. 
3. Never use class for styling. Use id instead. Classes can be used if an element/component/page has style variants.
4. Everyime you make a component or a page, its most ancestor element should be a HTML container semantic tag that best represent its content. If none can be chosen out of the semantic html container elements, <div> may be used.
5. id's and classes of elements should be in camel case from its component/page's corresponding CSS Module.
6. Always % for sizing, dimension or spacing units so that it's proportional to its parent element. You can only use rem but for font-sizes only. Except for the following in which you are allowed to use px: border-radius.
7. Never use <>/</> or ReactJS' equivalent of SolidJS' <Framgment>
8. You do not have to run `npm run build` to check if it builds correctly because as we develop the gui, I am actively looking at the development mode of the site. I will mention if anything is wrong.
9. You are not to put the title in the logo when designing unless you are explicityly being told.
10. gui codespace has to be completely ReactJS and NextJS idiomatic.

### Architecture
- The Message app is a separate app within the `dvibd` workspace. It is distinct from `social`; `social`'s left nav intentionally omits messages because messaging lives here.
- It shares `orm/` (Prisma schema, generated client) and `db/` (Postgres) with the other apps in the project. It does not define its own schema.
- Follow the same self-contained backend pattern as `social` where applicable: auth HTTP routes live directly under `src/routes/(auth)/` with no `/api` prefix; page files stay client-safe (verb handlers live in `(auth)/(endpoints)/`), and server-only modules (bcrypt, prisma, pg, h3) must never be imported into a file with a default page component.

### Layout
- [Document the Message app's page/component layout as development proceeds, mirroring the structure used in `social` (side nav, main content, and any secondary rail) and its CSS Module conventions above.]
