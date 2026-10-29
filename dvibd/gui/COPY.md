# dvibd copy deck

Source of truth for every visible string on `dvibd/gui`. The frontend implements this deck exactly. Structure notes are for markup and layout only; they are not visible text.

Direction: `product-performs`, seed 527879221. Palette: Indigo dusk, the live app palette. Deep indigo near-black ground, translucent panels, indigo accent, and the app's own status marks for likes, reposts, success, idle, and danger. Page display face: Bricolage Grotesque. Page text: Rethink Sans. Product fragments are the app's own interface, cropped at true size, with Lexend headings and Rethink Sans body.

Rules this deck follows: sentence case, no em dashes, no exclamation marks, no invented statistics, testimonials, logos, press, response times, or team details. No end to end encryption claim. No privacy policy is referenced because none is published.

## Contents

1. Global strings
2. Fragment library
3. Landing `/`
4. Products `/products`
5. About `/about`
6. Contact `/contact`
7. Auth `/login` and `/signup`
8. 404
9. Microcopy and states
10. Links and destinations
11. Type roles
12. Content status

## 1. Global strings

### Wordmark

- Text: `dvibd.` The full stop is the accent colour. The letters are `--ink`.
- The logo mark keeps its existing shape and is recoloured to the page accent and ink by the frontend. It sits before the wordmark and carries `alt=""` because the wordmark already names the company.
- Never put the page title in the logo.

### Navigation

- Links, in order: `Products` to `/products`, `About` to `/about`, `Contact` to `/contact`.
- Signed out actions: `Log in` to `/login`, `Sign up` to `/signup`.
- Signed in: the profile control shows `@` followed by the username, with accessible name `Account menu`. The menu holds one item, `Sign out`.
- Mobile menu button: `Menu`. Open state: `Close`. The panel it opens is labelled `Site menu`.
- Skip link, first focusable element: `Skip to content`, targeting the page `main` element. The target is reached through the CSS Module id shared by the layout and the main element, or by moving focus with script. Never hardcode a raw unhashed id.

### Theme control

- Dark page: visible label `Light`, accessible name `Switch to light mode`.
- Light page: visible label `Dark`, accessible name `Switch to dark mode`.
- The page starts dark. The control is the only way into light mode. It sits in the navigation, beside the auth actions.

### Footer

- Large wordmark: `dvibd.`
- Tagline: `The networking company.`
- Links, one row: `Products`, `About`, `Contact`, `Social`, `Message`, `Log in`, `Sign up`.
- Email links: `support@dvibd.com`, `press@dvibd.com`.
- Copyright: `© 2026 dvibd` with the year taken from the current date at render.
- Product line: `Social and Message are dvibd products.`
- Keep the footer a designed close: large wordmark, tagline, one row of links, one email pair, one product line. No column headings, no link farm.

## 2. Fragment library

Every fragment is a cropped piece of the real product, built in HTML, at true interface size, with its root marked `data-ui`. Inside, the app's own tokens apply: `--ui-paper`, `--ui-surface`, `--ui-ink`, `--ui-soft`, `--ui-line`, indigo `--ui-accent` for actions, and the like and repost marks in their own colours. Fragment headings are Lexend (`--font-product`); fragment body and interface text are Rethink Sans (`--font-ui`). No fragment is placed in a browser or laptop frame.

Names here are referenced by the page sections below.

### F1 Account bar

- Avatar: initials `AC` on `--ui-accent` with `--ui-accent-ink` text.
- Name: `Aria Chen`.
- Handle: `@ariachen`.
- Role line: `Product Designer`.
- App chips: `Social`, `Message`, both in the active state, each carrying its own app mark.

### F2 Social post, Aria Chen

- Author: `Aria Chen`, handle `@ariachen`, role `Product Designer`.
- Community: `Design Tokens`, with the Social mark.
- Time: `2h`, a render state rather than content.
- Body: `Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd`
- The tag `#dvibd` is a link in the app's accent ink.
- Actions: `Like`, `Reply`, `Share to Message`.
- States: `Like` shows a pressed state on activation. `Reply` and `Share to Message` are buttons that open nothing in this preview and must not claim to.

### F3 Message thread, Sofia Reyes

- Header: `Sofia Reyes`, handle `@sofia.reyes`, second line `Direct message`, with the Message mark.
- Sent message from Aria: `Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd`
- Received message from Sofia: `Sending this to the team.`
- Composer placeholder: `Message Sofia Reyes`.
- Send button, accessible name: `Send message`.

### F4 Community list

- Rows: `Design Tokens`, `Indie Hacking`, `SolidJS`.
- Each row shows a square community mark in the app accent, the name, and a state chip: `Joined` on the first two, `Join` on the third.
- No member counts.

### F5 Composer

- Author line: `Aria Chen` with the avatar `AC`.
- Community selector label: `Post to`, selected value `Design Tokens`.
- Text field placeholder: `What are you working on?`
- Photo control, accessible name: `Add photos`.
- Primary button: `Post`.

### F6 Group members

- Group name: `Weekend build`.
- Members: `Aria Chen` with initials `AC`, `Sofia Reyes` with `SR`, `Marcus Lee` with `ML`, each with a role label `Member` and initials on `--ui-accent`.
- Row label above the list: `3 people`.
- Button: `Add people`.

### F7 Profile chip

- Avatar `AC`, name `Aria Chen`, handle `@ariachen`, role `Product Designer`.
- Status line: `On Social and Message`.

### F8 Account card

One card, used four times, with the context line changing each time. Fixed content in every copy:

- Avatar `AC`, name `Aria Chen`, handle `@ariachen`, role `Product Designer`.

Context line, per copy:

1. `Profile`: `On Social and Message`.
2. `Community membership`: `Member of Design Tokens and Indie Hacking`.
3. `Post author`: `Posted in Design Tokens`.
4. `Message participant`: `In a group with Sofia Reyes and Marcus Lee`.

### F9 Create account dialog

- Title: `Name your account`.
- Field label: `Display name`.
- Field value on load: `Aria Chen`, editable.
- Button: `Continue`.
- Note under the button: `The sign-up page finishes the account.`
- Empty name error: `Add a name to continue.`

### F10 Social feed

- Composer, collapsed: placeholder `What are you working on?`, community chip `Design Tokens`, button `Post`.
- Under it, the F2 post, unchanged.
- Not placed on the page: the Social chapter uses the Social capture from F13. F2 and F5 describe the fragments that are actually built.

### F11 Message thread, wide crop

- Same content as F3 in a wider crop: header, the two messages, composer.
- Not placed on the page: the Message chapter uses the Message thread capture from F13. F3 describes the thread fragment that is actually built. F6 covers group membership.

### F12 Preview message panel

- Header: `Sofia Reyes`, second line `Direct message`.
- Message bubble: the live text from the editable post draft, carried across word for word.
- Primary button: `Send to Sofia`.
- Status before activation: `Ready to send`.
- Status after activation: `Sent in this preview`.
- Note under the status: `This is a preview. Nothing is sent from this page.`
- Reply that appears after activation, from Sofia: `Sending this to the team.`

### F13 Product screenshots

Three captures of the live apps, taken locally: Social on `http://localhost:3003`, Message on `http://localhost:3005`. They are the page's imagery, shown at or near true interface size with the app's own indigo interface. Every label stays legible, so a capture is never scaled up and never cropped below its readable size. There is no external credit: the footer product line `Social and Message are dvibd products.` is the only provenance note, and no caption presents a capture as a customer, an office, or the team.

`src/assets/pages/dvibd/home/social-profile.jpg`, 640 by 960:

- The Social profile for Aria Chen, with the post `Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd`, the side navigation, and the explore rail.
- Used on the hero stage, in the two-up after the hero, and in the Social chapter on `/products`.
- Caption: `Social, @ariachen's profile.`
- Alt text: `Social profile for Aria Chen with the new feed post.`

`src/assets/pages/dvibd/home/message-thread.jpg`, 713 by 960:

- The `#general` conversation on its own.
- Used in the two-up after the hero and in the Message chapter on `/products`.
- Caption: `Message, the #general conversation.`
- Alt text: `Message thread showing the #general conversation and the new signals discussion.`

`src/assets/pages/dvibd/home/message-workspace.jpg`, 1440 by 960:

- The wider workspace, with the channel list and `#general` open.
- Used as the wide image before the closing CTA on `/` and as the band on `/about`.
- Caption: `Message workspace, with the channel list and #general.`
- Alt text: `Message workspace with the channel list on the left and the #general conversation open.`

## 3. Landing `/`

### 3.1 Hero

- h1, two lines:
  1. `Two apps.`
  2. `One account.`
- Supporting paragraph: `Social is a community feed, Message is a private chat, and both run on the same dvibd account.`
- Primary action, a button: `Create account` to `/signup`.
- Secondary action, a text link: `See how it works` to the how it works section, with the anchor built from that section's CSS Module id rather than a raw hash.

Structure: headline in the upper left third, flush left, two lines. Supporting sentence under it, then the two actions. The right and lower part of the screen is one flat stage in `--stage`, starting about 42% down, spanning the right seven columns, bleeding off the right and bottom edges, its top left corner cut with a single chamfer. The stage holds the Social capture from F13 at near 1x, inset from its top and left edges and cropped by the stage bottom. There is no HTML fragment stack in the hero.

### 3.2 Two-up after the hero

Two portrait captures side by side directly after the hero, at true size, with a caption in small type under each. The Social capture sits left, the Message thread capture right. The Social capture carries the page's one shutter move: it opens from its left edge with a clip-path over about 1.1s while the image settles from 1.12 scale to rest. It is the only moving image on the page.

### 3.3 Features

- h2: `Inside both apps`
- Six cells, each a filled panel one tone above the ground, no outline. Each cell holds a title, three lines of text, and the named fragment docked against one edge and cropped by it. The stagger is the point: cells alternate text first and fragment first.

Cell one:

- Title: `A feed you follow`
- Text: `Posts and photos from the people you chose. Nothing is ranked by a number you cannot see. Communities sit next to your feed.`
- Fragment: F2.

Cell two:

- Title: `Communities by subject`
- Text: `Join the ones that match what you make. Each community keeps its own feed. Leave whenever you like.`
- Fragment: F4.

Cell three:

- Title: `Compose in a moment`
- Text: `Write a post, add photos, pick a community. A draft waits until you post it. Nothing is published twice.`
- Fragment: F5.

Cell four:

- Title: `Direct messages`
- Text: `One person, or a small group. Messages arrive in the order they were sent. The thread keeps the whole conversation.`
- Fragment: F3.

Cell five:

- Title: `Groups stay small`
- Text: `Add only the people who need to be there. Everyone in the group sees the same thread. Your other chats stay separate.`
- Fragment: F6.

Cell six:

- Title: `One profile everywhere`
- Text: `Your name and handle follow you into both apps. Your communities carry over. Your friends are the same list.`
- Fragment: F7.

No feature icons, no counts, no numbers.

### 3.4 Handoff showcase

- h2 split across the two fields, one baseline, one line each:
  - Left field, bottom left: `A post becomes`
  - Right field, bottom right: `a message`
- Left field, the editable draft:
  - Label: `Your post`
  - Author line: `Aria Chen in Design Tokens`
  - Default editable text: `Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd`
  - The region is a real editable text field at 20 to 24px, about 34 characters wide.
- Right field, the message:
  - Label: `Message to Sofia Reyes`
  - Fragment F12, carrying the left field's text live as it is typed.
  - Button `Send to Sofia` only updates the status. It never sends anything.
  - After activation the status reads `Sent in this preview`, the button is disabled, and Sofia's reply appears. Reloading the page returns it to `Ready to send`.

Structure: two flat fields meeting on a vertical edge at half the viewport, no gap, about 90svh tall. Left field is `--bg`, right field is `--ui-paper`, so the product's paper is the light half. On mobile the fields stack, draft above message.

### 3.5 How it works

- h2: `One account, four places`
- Four clauses, one per field, two lines each:
  1. `Your profile, set once.`
  2. `Your communities, carried over.`
  3. `Your posts, signed the same way.`
  4. `Your messages, from the same person.`
- Fragment: F8 in all four fields, with the context line for that field.

Structure: four flat fields butted across the full viewport, equal width, about 84svh tall, no gaps, stepping in tone from `--bg` through `--bg-soft` and `--surface` to `--surface-strong`. The heading sits top left in the first field only. The card sits at the same height in each field. The clause sits at the foot of each field. No numbering, no step words. The section carries the anchor id `how-it-works`.

### 3.6 FAQ

- h2, the first line of the question list, in the softer ink: `Common questions`

Question one:

- `Do Social and Message use the same account?`
- `Yes. One dvibd account covers both apps. Your profile, your friends, and your communities are the same in each one.`

Question two:

- `Is Message free?`
- `Yes. Message costs nothing to use, whether you are writing to one person or to a group.`

Question three:

- `Can I share a post into a chat?`
- `Yes. Share a post into a one to one chat or a group, and everyone there can read it.`

Question four:

- `Who can see my messages?`
- `Only the people in the conversation. Messages are not end to end encrypted, so treat a message the way you would treat an email.`

Structure: questions in the left five columns at one size, each preceded by a solid dot that takes the indigo accent when selected. The selected answer sits in a sticky pane in the right six columns at answer size, about 30 characters wide. Hover, click, and keyboard focus all select. The first question is selected on load. On mobile the answer opens under its question and the pane is gone.

### 3.7 Message workspace band

Wide image before the closing CTA. The Message workspace capture from F13, at full width, with its caption under the image.

### 3.8 Closing CTA

- Closing line, two lines, in `--text-cta`:
  1. `Start with`
  2. `your name.`
- Supporting sentence: `Type a name, continue, and the sign-up page finishes the account.`
- Fragment: F9, the create account dialog, at true size, with the shadow a dialog normally casts.
- Continue action: navigates to `/signup?name=` followed by the typed name, URL encoded. An empty field shows the F9 error and does not navigate.

Structure: one full bleed field in `--accent` about 90svh tall. The closing line and the sentence are set in `--accent-ink` on that field, never in `--ink`. Dialog in the right columns, vertically centred. Closing line and sentence anchored bottom left. The upper left stays empty on purpose. On mobile the closing line leads, then the sentence, then the dialog full width.

## 4. Products `/products`

### 4.1 Hero

- h1, two lines:
  1. `What Social`
  2. `and Message do.`
- Supporting paragraph: `Two apps on one dvibd account, and here is what each one does.`

### 4.2 Social chapter

- h2: `Social`
- Tagline: `Share your world.`
- Paragraph: `Social is a community feed. Post a photo or a thought, follow the people you want to hear from, and join communities built around what you make.`
- Three points:
  1. `A feed of posts, photos, and updates from the people you follow.`
  2. `Communities built around shared interests.`
  3. `Discover people and topics that matter to you.`
- Image: the Social capture from F13, at true size beside the text.
- Action: `Open Social` to the Social app.

### 4.3 Message chapter

- h2: `Message`
- Tagline: `One to one, or a small group.`
- Paragraph: `Message is a private chat. Write to one person or start a small group, keep the thread, and pick it up on any device.`
- Three points:
  1. `One to one chats and small group conversations.`
  2. `A thread that keeps the whole conversation in order.`
  3. `Works on any device, wherever you are.`
- Image: the Message thread capture from F13, at true size beside the text.
- Action: `Open Message` to the Message app.

Structure: the two chapters are full width rows, each a text half and a captured app half, and the capture side swaps between them. Each capture is shown at true size, never stretched, never framed, never inside a device. The text half keeps the tagline, the paragraph, the three points, and the action. No statistics, no app store badges.

### 4.4 Shared account

- h2: `The same account in both`
- Paragraph: `Your profile, your friends, and your communities are one set. Join a community in Social, then start a conversation with someone you met there.`
- Fragment: F8, the profile context copy.

Structure: one wide band on `--surface`, the account card at true size on one side and the text on the other.

### 4.5 FAQ

- h2: `Common questions`

Question one:

- `Do I need two accounts?`
- `No. One dvibd account opens both apps, and your profile and friends are the same in each.`

Question two:

- `Can I use one app without the other?`
- `Yes. Both apps come with the account. Use Social, Message, or both, and nothing is locked behind the other.`

Question three:

- `Is Message free?`
- `Yes. Sending messages and starting groups cost nothing.`

Question four:

- `How do I report a problem?`
- `Use the report option inside the app for a post or a message. For anything else, email support@dvibd.com with what happened and which app you were in.`

Structure: same question index and sticky answer pane as the landing FAQ, so the two pages do not invent a second pattern.

### 4.6 Closing CTA

- h2: `Start in either app.`
- Sentence: `Create one account, then open Social or Message.`
- Primary action, a button: `Create account` to `/signup`.
- Text links: `Open Social`, `Open Message`.

## 5. About `/about`

### 5.1 Hero

- h1, two lines:
  1. `A small team,`
  2. `two apps.`
- Supporting paragraph: `dvibd is an independent team of a few people making two apps, Social and Message, on one shared account.`

### 5.2 Why we are here

- h2: `Why we are here`
- Statement paragraph: `We wanted a place to talk that did not feel like a performance.`
- Supporting paragraph: `Social keeps the feed calm and the communities specific. Message keeps a conversation between the people in it. Both are small on purpose, and the same few people build both, so a decision in one app can be answered in the other.`

No founding year, no locations, no biographies.

### 5.3 Principles

- h2: `What we believe`

Principle one:

- Name: `Connection first`
- Paragraph: `We measure the apps by how well they bring people closer, not by screen time. A feed that keeps you scrolling is not the goal.`

Principle two:

- Name: `Borderless`
- Paragraph: `Distance, devices, and time zones should never be the reason a conversation stops.`

Principle three:

- Name: `Privacy by default`
- Paragraph: `What you share, and who you share it with, is your choice. Messages stay with the people in the conversation.`

Principle four:

- Name: `Simplicity`
- Paragraph: `Software should get out of the way. If a screen needs explaining, we have not finished it.`

These four carry the existing site's claims. Do not add no ads, no tracking, or encryption claims.

### 5.4 Message workspace band

Wide band on `--bg-soft` using the Message workspace capture from F13, with its alt text and caption. The capture sits at true size within the band rather than being stretched, so every label stays legible. No overlay text on the image.

### 5.5 The apps

- h2: `The apps`
- Paragraph: `Everything above goes into two products. Social is the feed and the communities. Message is the conversations. Both open with the same account.`
- Text links: `Open Social`, `Open Message`.

Structure: a designed split, two large text links side by side with generous space, not a card grid.

## 6. Contact `/contact`

### 6.1 Hero

- h1, two lines:
  1. `Write to`
  2. `a person.`
- Supporting paragraph: `Support, press, and product questions all reach the same small team, and we read every message.`

### 6.2 Ways to reach us

- h2: `Ways to reach us`

Support:

- Name: `Support`
- Description: `Account help, reports, and questions about either app.`
- Link: `support@dvibd.com` to `mailto:support@dvibd.com`.

Press and business:

- Name: `Press and business`
- Description: `Partnerships, media questions, and business inquiries.`
- Link: `press@dvibd.com` to `mailto:press@dvibd.com`.

Social:

- Name: `Social`
- Description: `Find us in the Social app.`
- Link: `Open Social` to the Social app.

Message:

- Name: `Message`
- Description: `Prefer chat? Write to us in Message.`
- Link: `Open Message` to the Message app.

Structure: four rows, name and description on one side, link on the other. Not four identical cards.

### 6.3 Contact form

- h2: `Send us a message`
- Intro: `Tell us what happened, and which app you were using.`
- Labels: `Name` required, `Email` required, `Subject` optional, `Message` required.
- Required marker: a visible `Required` next to each required label, and `Optional` next to Subject. Do not rely on an asterisk alone.
- Button: `Open email draft`.
- Helper text under the form: `This opens your email app with the message ready to send to support@dvibd.com.`
- Fallback line: `If nothing opens, email support@dvibd.com directly.` The address is a `mailto:` link.

The form never posts anywhere. It composes a `mailto:` with the subject and body filled from the fields.

Field errors, shown inline next to the field and announced:

- Missing name: `Add your name so we know who we are replying to.`
- Invalid email: `That email address needs an @ and a domain. Check it and try again.`
- Missing message: `Write a line about what you need before opening the draft.`

### 6.4 FAQ

- h2: `Before you write in`

Question one:

- `I cannot log in. What should I do?`
- `Check that you are using the same username or email you signed up with. If it still fails, write to support@dvibd.com from the email on the account and we will look.`

Question two:

- `Where do I send feedback?`
- `Use this page, or email support@dvibd.com. Say which app you were in and what you expected to happen.`

Question three:

- `How do I report a post or a message?`
- `Use the report option inside the app. If you cannot find it, email support@dvibd.com with a link or a screenshot and we will take a look.`

Do not promise a password reset flow, because there is none.

### 6.5 Closing CTA

- h2: `Rather look around first?`
- Sentence: `The products page explains both apps, and the about page explains why there are two.`
- Text links: `Explore products` to `/products`, `About dvibd` to `/about`.

## 7. Auth

### 7.1 Log in `/login`

- h1: `Log in`
- h1 size: `--text-h2`, not `--text-h1`, so the form stays the main object on the screen.
- Supporting paragraph: `Use the username or email on your dvibd account. The same account opens Social and Message.`
- Field label: `Username or email`, placeholder `you@example.com`.
- Field label: `Password`, placeholder `Your password`.
- Button: `Log in`. Pending: `Logging in`.
- Error, wrong details: `That username and password do not match. Check both and try again.`
- Error, unreachable server: `Cannot reach the server. Check your connection and try again.`
- Switch line: `No account yet?` followed by link `Sign up`.
- On success the visitor goes to `/`.

### 7.2 Sign up `/signup`

- h1: `Create your account`
- h1 size: `--text-h2`, as on the login page.
- Supporting paragraph: `One account for Social and Message. Your profile, friends, and communities are the same in both.`
- Fields, in order: `Full name` required, `Username` required, `Email` required, `Password` required.
- Placeholders: `Your full name`, `Your username`, `you@example.com`, `Create a password`.
- Button: `Sign up`. Pending: `Signing up`.
- Errors:
  - Username or email already used: `That username or email already has an account. Log in instead, or pick another username.`
  - Missing or malformed field: `Check the fields above and try again.`
  - Unreachable server: `Cannot reach the server. Check your connection and try again.`
- Switch line: `Already have an account?` followed by link `Log in`.
- Prefill note, shown only when the URL carries `?name=`: `This name came from the home page. Change it if you like.` The value is decoded and put in `Full name`.
- On success the visitor goes to `/`. There is no separate success screen, so no success copy.

Required markers and pending labels follow section 6.3.

## 8. 404

- h1: `This page does not exist.`
- h1 size: `--text-h2`, so the page reads as a notice rather than a landing.
- Supporting paragraph: `The link may be old, or the address may have a typo.`
- Links: `Back home` to `/`, `Explore products` to `/products`.

Structure: standalone inside the normal site layout, with navigation and footer, no feed, no product fragment.

## 9. Microcopy and states

- Skip link: `Skip to content`.
- Mobile menu: `Menu`, `Close`, panel label `Site menu`.
- Theme control: `Light`, `Dark`, with accessible names `Switch to light mode`, `Switch to dark mode`.
- Showcase status: `Ready to send`, then `Sent in this preview`.
- Showcase note: `This is a preview. Nothing is sent from this page.`
- Dialog empty name: `Add a name to continue.`
- Contact form errors and fallback: section 6.3.
- Auth errors and pending labels: section 7.
- No success toast anywhere on the site. The only success language is the showcase status, and it says preview.
- Loading states: only the auth buttons change their label while pending. No spinners elsewhere.

## 10. Links and destinations

| Label | Production | Local development |
| --- | --- | --- |
| `Open Social`, `Social` | `https://social-dvibd.netlify.app` | `http://localhost:3003` |
| `Open Message`, `Message` | `https://message-dvibd.netlify.app` | `http://localhost:3005` |
| `Create account`, `Sign up` | `/signup` | `/signup` |
| `Log in` | `/login` | `/login` |
| `Products`, `Explore products` | `/products` | `/products` |
| `About`, `About dvibd` | `/about` | `/about` |
| `Contact` | `/contact` | `/contact` |
| `Back home` | `/` | `/` |
| `support@dvibd.com` | `mailto:support@dvibd.com` | same |
| `press@dvibd.com` | `mailto:press@dvibd.com` | same |

The frontend picks the base by environment. Labels never change between environments.

## 11. Type roles

| Text | Token | Face and weight |
| --- | --- | --- |
| Hero h1, closing line | `--text-h1`, `--text-cta` | `--font-display`, 600, `--tracking-display`, `--leading-display` |
| Section h2 | `--text-h2` | `--font-display`, 600, `--tracking-display` |
| Cell and card titles, h3 | `--text-lead` | `--font-display`, 600, `--tracking-heading` |
| Supporting and body paragraphs | `--text-body` | `--font-body`, 400, `--leading-text` |
| Statement paragraph | `--text-lead` | `--font-body`, 400 |
| Navigation, footer links, buttons | `--text-sm` | `--font-ui`, 500 |
| Captions, status, helper text | `--text-xs` | `--font-ui`, 400 |
| Inside `data-ui`, body and interface text | `--text-xs`, `--text-sm` | `--font-ui`, 400 and 500 |
| Inside `data-ui`, headings and names | `--text-sm`, `--text-lead` | `--font-product`, 500 and 600 |

Three faces, each with one job. Bricolage Grotesque carries the page. Lexend carries fragment headings, names, and panel titles. Rethink Sans carries page navigation, buttons, captions, and all fragment body and interface text. Never set a fragment heading in Bricolage, and never set page display type in Lexend.

Colour rules that follow from the palette:

- Page text is `--ink`, secondary text is `--ink-soft`, on `--bg` and `--bg-soft`. Panels are `--surface` and `--surface-strong` over the ground, separated by tone, not by borders or shadows.
- Text on the `--accent` and `--stage` fields is `--accent-ink`, in both themes.
- Indigo is the only page accent. It appears on the primary button, the selected FAQ dot, and small markers. Never inside a fragment.
- `--like`, `--repost`, `--success`, `--idle`, and `--danger` are product states, never page decoration. `--danger` and `--danger-soft` carry form and auth errors on the page.
- Inside `data-ui`, only the `--ui-*` tokens apply, including the indigo app accent and its own like and repost marks. Page copy never sits inside a fragment.

## 12. Content status

Real fixture content, keep as written:

- `Aria Chen` (`@ariachen`, Product Designer), `Sofia Reyes` (`@sofia.reyes`), `Marcus Lee`.
- The communities `Design Tokens`, `Indie Hacking`, `SolidJS`.
- The seed post `Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd`, and the message thread built from it.
- The group `Weekend build` and its three members.

Captured, not invented:

- The three captures in F13 are taken from the live local apps. Retake them if the interface changes before launch, and keep the captions and alt text above.

Display state, not content:

- The relative time `2h` in F2, the like and reply states, and the preview status in F12 are render states, not copy. Keep them consistent with the apps when the captures are taken.

Nothing in this deck is an invented statistic, testimonial, customer logo, press quote, or proof. There is no end to end encryption claim and no privacy policy reference. The FAQ answer about who can see messages stays as written, plaintext and honest.
