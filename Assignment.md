### Getting it Running



### Setup

- `npm create vite@latest` creates a vite typescript file (Vite typescript setup is different from vanilla typescript setup)

- `npm i express rowdy-logger dotenv` 

- For rowdy-logger since there's no @types/rowdy-logger, create a types folder with file named rowdy-logger.d.ts with `declare module "rowdy-logger";` inside of it

- `npm i -D @types/express @types/node concurrently tsx`

```
In package.json replace dev with these scripts
We're doing vite --host 0.0.0.0 that way it uses local ip when access outside the server

"dev": "concurrently -k \"npm:dev:client\" \"npm:dev:server\"",
"dev:client": "vite --host 0.0.0.0",
"dev:server": "tsx watch server.ts",
```

- create a vite config file to create a proxy so frontend can call backend `touch vite.config.ts`

```
# inside vite.config.ts

import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:${PORT}"
    }
  }
});

```

- frontend can now `fetch("/api/test")` instead of `http://localhost:${PORT}/api/test`


- in tsconfig.json `"include": ["src", "server.ts", "types"]` Otherwise TS sometimes won’t pick it up. also, `"types": ["vite/client", "node"]`

### What are things!?

<details><summary>What is tsx?</summary>
<p>
Tsx lets node run TypeScript files directly without compiling

- `tsx server.ts` is like running `node server.js`
- `tsx watch server.ts` is like running nodemon
<p>
</details>


<details><summary>What is concurrently?</summary>
<p>
concurrently lets you run multiple commands at once, without it, you'd need 2 or more terminals to run it
<p>
</details>


<details><summary>What is this command? "concurrently -k \"npm:dev:client\" \"npm:dev:server\""</summary>
<p>
concurrently lets you run multiple commands at once, -k kills other processes if one process exits or crashes.
<p>
</details>