# `pics` Project Context

Repository-wide standards and instructions live in the repository root `AGENTS.md`. This file covers only the `pics` workspace.

## Scope
- `pics` is the dvibd image platform: upload, store, organise, and browse pictures, photos, and images.
- Stack: PHP 8.3+ (local PHP 8.5), Laravel 13.40, Livewire 4.4, Blade, Flux UI 2, Fortify, Pest 5, Larastan level 7, Pint, Vite Plus, and Tailwind CSS 4.
- This is the repository's only PHP workspace. Do not apply the Node typecheck matrix commands to it; use `composer types:check`.
- The scaffold is the Livewire starter kit baseline. It does not yet contain image domain models, upload handling, derivative generation, or gallery screens.

## Commands
- Install dependencies: `composer install && npm install`
- Development: `composer dev`. Laravel's `artisan dev` runs the PHP server on `SERVER_PORT=3008`, the queue listener, and Vite.
- Tests: `composer test`. This runs Pint's check, Larastan, and Pest.
- Lint: `composer lint` writes formatting fixes; `composer lint:check` verifies formatting only.
- Static analysis: `composer types:check`. PHPStan runs with `--memory-limit=1G`.
- Build assets: `npm run build`. Use Node 24 LTS, matching the repository Node policy.
- Apply migrations: `php artisan migrate`
- Create the public storage link: `php artisan storage:link`

## Runtime
- PHP 8.3 or newer is required by `composer.json`; local development uses PHP 8.5.
- Required extensions: `pdo_pgsql`, `pdo_sqlite`, `gd`, `intl`, `bcmath`, `exif`, `iconv`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`, `curl`, and `zip`.
- Authenticated browser routes use Fortify with the Livewire starter kit, including passkeys.
- Vite Plus builds the assets into `public/build`; the build output is gitignored.

## Database
- Pics uses its own PostgreSQL database, `dvibd_pics`, on the shared local instance in `db/` (`127.0.0.1:3001`, user `dvibd`, password `dvibd`).
- Create the database once with `CREATE DATABASE dvibd_pics OWNER dvibd;`.
- Laravel migrations in `pics/database/migrations` own the Pics schema. Do not add Pics models or tables to `orm/prisma/schema.prisma`; Pics is not a Prisma client.
- Tests use SQLite in memory, as configured in `phpunit.xml`, so `pdo_sqlite` is required locally and tests never touch `dvibd_pics`.
- Never run `prisma migrate` or `prisma db push` against `dvibd_pics`.

## Environment
- Local configuration lives in the gitignored `pics/.env`; `.env.example` is the committed template.
- The repository `LOCAL_ENV` marker policy is implemented by the Node services. Laravel resolves configuration through `.env` and `config/*.php`, so Pics does not set `LOCAL_ENV`. The committed local defaults still point only at the `db/` service and never at hosted services.
- `APP_URL` and `SERVER_PORT` are both `3008` so the HTTP server and generated URLs share one origin.
- Generate a per-environment `APP_KEY` with `php artisan key:generate`. Never commit `.env`.

## Storage
- `originals` is the private disk for uploaded originals at `storage/app/originals`, with serving disabled.
- `derivatives` is the public disk for generated display images at `storage/app/public/derivatives`, served through `/storage`.
- Run `php artisan storage:link` before public derivatives are expected to resolve.
- Production needs an object store or a persistent volume. Netlify functions have neither, so this is part of the deployment decision.

## Code Style
- PHP follows Laravel Pint with the `laravel` preset. That preset prefers single quotes for simple strings, so the repository double-quote rule is scoped to JS/TS code here.
- Larastan level 7 is the static analysis gate. Keep new PHP typed where the language and framework allow, and run `composer types:check` before handing work off.
- Do not add code comments unless explicitly asked.

## Styling
- Pics uses the Livewire starter kit's Tailwind 4 and Flux UI components. This is a scoped exception to the CSS Module and mirrored-file rules in the root `AGENTS.md` GUI Standards: Blade and Livewire have no CSS Module pipeline, and Flux ships its own component styles.
- Keep long-lived design tokens in `resources/css/app.css`. Keep page-specific styling in the Blade and Livewire components that own it.
- The repository's semantic HTML, keyboard operation, focus visibility, reduced motion, and color contrast requirements still apply.
- Do not apply the SolidJS, React, or Svelte framework idioms to Pics. Laravel, Livewire, and Blade conventions win here.

## Structure
- `app/Actions/Fortify/` contains the authentication actions.
- `app/Livewire/` contains Livewire components and actions.
- `app/Models/` contains Eloquent models.
- `resources/views/` contains Blade views. `resources/views/pages/` holds the page-level Livewire views used by `routes/settings.php`.
- `routes/web.php` holds public and authenticated application routes.
- `routes/settings.php` holds the Fortify and settings routes.
- `database/migrations/` is owned by Laravel and is the Pics schema source of truth.
- `tests/Feature/` and `tests/Unit/` contain Pest tests.

## Deployment
- Netlify cannot host a PHP runtime and has no persistent filesystem, so `pics` has no `netlify.toml` and is not part of the Netlify deployment section in the root `AGENTS.md`.
- The deployment target is not chosen yet. A decision needs to cover PHP hosting, a persistent or object-backed filesystem for originals and derivatives, and the `dvibd_pics` database connection.

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

## Foundational Context

This application is a Laravel application running on PHP 8.5. Always use the APIs that match the installed major version of each package: do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain; do not wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If a frontend change doesn't show in the UI or you get a "Unable to locate file in Vite manifest" error, run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists, including path-scoped framework guidelines under `.ai/rules/boost`. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.
- Activate the `deploying-to-cloud` skill whenever deploying to Laravel Cloud, configuring Cloud environments or resources, using the Cloud CLI, or troubleshooting Cloud deployments.

=== tests rules ===

# Test Enforcement

- Add or update tests for behavior and logic changes when a test provides meaningful regression coverage.
- Pure copy, styling, and layout-only changes do not require new or updated tests.
- When test coverage applies, run the affected tests and ensure they pass.
- Test the changed behavior and its important failure modes, but do not add tests beyond them.
- Read the `testing-best-practices` skill before writing tests.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

=== livewire/core rules ===

# Livewire

- Livewire allows you to build dynamic, reactive interfaces in PHP without writing JavaScript.
- You can use Alpine.js for client-side interactions instead of JavaScript frameworks.
- Keep state server-side so the UI reflects it. Validate and authorize in actions as you would in HTTP requests.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

# Pest

- This project uses Pest. Create tests with `php artisan make:test --pest {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.
- Do not delete tests or test files without approval. They are part of the application.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `php artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/pest` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.

</laravel-boost-guidelines>

## Laravel Boost
- `laravel/boost` v2.10.4 is installed as a dev dependency. `php artisan boost:install` generated the `<laravel-boost-guidelines>` block above, the local MCP server `php artisan boost:mcp`, and eight skills under the repository-level `.agents/skills`: `deploying-to-cloud`, `fluxui-development`, `fortify-development`, `infer-conventions`, `laravel-best-practices`, `livewire-development`, `tailwindcss-development`, and `testing-best-practices`.
- The skills are discovered automatically from the repository-level `.agents/skills`. The root `.opencode/opencode.json` registers the Boost MCP server. `pics/config/boost.php` sets Boost's OpenCode skills path to `../.agents/skills`, so `boost:update` keeps the generated skills in the repository directory instead of under `pics/`.
- `php artisan boost:update` regenerates the block and the skills after Laravel ecosystem updates. A fresh checkout has no `pics/boost.json` because it is gitignored, so run `php artisan boost:install` once before `boost:update`. Review the diff; do not hand-edit the generated block or generated skills. Custom skills belong in `.ai/skills`.
- After `git clean -xfd` or a fresh clone, `npx skills experimental_install` restores the forty locked skills but not these eight. Run `composer install` and `php artisan boost:install` in `pics/`, select OpenCode, and let the config write the skills back to `.agents/skills`.
- The generated block is advisory. This file and the root `AGENTS.md` win on conflicts. Its Deployment section recommends Laravel Cloud, but the deployment target for `pics` remains undecided as stated above.
- `pics/boost.json` records the selected features and skills, and `pics/opencode.json` is generated for sessions started inside `pics`. Both are generated. The generated block was sanitized for the repository no-em-dash rule; re-check it after `boost:update`.
