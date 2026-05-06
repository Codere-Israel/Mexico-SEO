export function CodereHelmet(seo, canonical) {
  const head = document.head;

  /* init */
  let x, y, z;
  x = document.querySelector('meta[name="description"]');
  y = document.querySelector('link[rel="canonical"]');
  z = document.querySelector("title");

  if (x) [x, y, z].forEach((node) => node && node.parentNode.removeChild(node));

  /* Title */
  const titleEl = document.createElement("title");
  titleEl.textContent = `${seo?.title}`;

  /* Description */
  const mdes = document.createElement("meta");
  mdes.setAttribute("name", "description");
  mdes.setAttribute("content", seo?.description);

  /* Canonical */
  var canonicalLink = document.createElement("link");
  canonicalLink.setAttribute("rel", "canonical");
  canonicalLink.setAttribute("href", `https://www.codere.mx${canonical}`);

  head.insertBefore(canonicalLink, head.firstChild);
  head.insertBefore(mdes, head.firstChild);
  head.insertBefore(titleEl, head.firstChild);
}

export const REGISTER =
  "https://www.codere.mx/registro-deportes?clientType=sportsbook";

const normalize = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const isolate = (node) => {
  if (!node || typeof node !== "object") return node;
  const { items, ...rest } = node;
  return rest;
};

export const searchHelp = (data, query, opts = {}) => {
  const needle = normalize(query);
  if (!needle || !data) return [];

  const out = [];
  const { limit } = opts;

  const matches = (node) => {
    if (!node) return false;
    return normalize(JSON.stringify(node)).includes(needle);
  };

  const push = ({ id, label, url }) => {
    out.push({ id, label, url });
    return limit && out.length >= limit;
  };

  for (const topic of Object.values(data)) {
    if (matches(isolate(topic)) && push(topic)) return out;

    const items = topic?.items || {};
    for (const sub of Object.values(items)) {
      if (matches(sub) && push(sub)) return out;
    }
  }

  return out;
};
