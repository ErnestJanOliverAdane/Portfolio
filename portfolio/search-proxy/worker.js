// NestoAI search proxy: a tiny Cloudflare Worker that keeps your search API key private.
// Uses the Brave Search API (https://brave.com/search/api/). Secrets: BRAVE_KEY. Optional var: ALLOW_ORIGIN (your site, e.g. https://yourname.netlify.app)
export default {
  async fetch(req, env) {
    const allow = env.ALLOW_ORIGIN || "*";
    const origin = req.headers.get("Origin") || "";
    const h = { "Access-Control-Allow-Origin": allow, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" };
    if (req.method === "OPTIONS") return new Response(null, { headers: { ...h, "Access-Control-Allow-Methods": "GET" } });
    if (allow !== "*" && origin && origin !== allow) return new Response('{"results":[]}', { status: 403, headers: h });
    const q = new URL(req.url).searchParams.get("q");
    if (!q || q.length > 200) return new Response('{"results":[]}', { status: 400, headers: h });
    const r = await fetch("https://api.search.brave.com/res/v1/web/search?count=5&q=" + encodeURIComponent(q), {
      headers: { "X-Subscription-Token": env.BRAVE_KEY, Accept: "application/json" },
    });
    if (!r.ok) return new Response('{"results":[]}', { status: 502, headers: h });
    const d = await r.json();
    const results = ((d.web && d.web.results) || []).slice(0, 5).map((x) => ({
      title: x.title, url: x.url, description: (x.description || "").replace(/<[^>]+>/g, ""),
    }));
    return new Response(JSON.stringify({ results }), { headers: h });
  },
};
