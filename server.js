// Startup file for hosts that launch a JS entry point instead of `next start`
// (Hostinger hPanel Node.js apps, Passenger, cPanel). Run `npm run build` first.
const { createServer } = require("http");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`ready on http://localhost:${port}`);
  });
});
