## Usage

```bash
npm install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. `/api` is proxied to `http://localhost:3002`, so run `dvibd/api` alongside this app for auth.

### `npm run build`

Builds the app for production to the `dist` folder. It runs `tsc -b` first, then Vite.

### `npm run preview`

Serves the production build locally.

## Deployment

The app is a client-side SPA and ships with an SPA redirect in `netlify.toml`. See the repository root `AGENTS.md` for the Netlify setup.
