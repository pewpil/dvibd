# Project Memory
- You should use a CSS Module and never CSS (except `index.css`) for a component/page's corresponding styling file imported as `style` in its TypeScriptXML file.
- Styling files should be written fully nested with its selector indicating the element's tag and id/class with an immediate child selector (>) by default unless decendants are targeted by the style.
- Refrain from using class for styling and use id instead. classes can be used if an element/component/page has style variants.
- Everyime you make a component or a page, its most ancestor element should be a <div> with its component/page name as its id.
- id's and classes elements should be in camel case from its component/page's corresponsing CSS Module.
- Never use <>/</> or solidjs' <Framgment>
