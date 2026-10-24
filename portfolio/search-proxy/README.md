# Give NestoAI full web search (optional)

Google's own search API is closed to new customers, so NestoAI uses Brave Search through a small proxy that keeps your key private.

1. Create an API key at https://brave.com/search/api/ (a card is required; set a usage limit so you stay within the free monthly credit).
2. In Cloudflare (free account): Workers & Pages -> Create Worker -> paste `worker.js` -> Deploy.
3. Worker Settings -> Variables and Secrets: add secret `BRAVE_KEY` (your key) and variable `ALLOW_ORIGIN` (your site address, e.g. `https://yourname.netlify.app`).
4. Open `index.html`, find `var SEARCH_URL="";` and put your worker address between the quotes, e.g. `var SEARCH_URL="https://nesto-search.yourname.workers.dev";`
5. Re-upload `index.html`.

Without this step NestoAI still answers from Wikipedia and always offers a "Search Google" link.
