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
  titleEl.textContent = `${seo?.metaTitle} | Codere®`;

  /* Description */
  const mdes = document.createElement("meta");
  mdes.setAttribute("name", "description");
  mdes.setAttribute("content", seo?.metaDescription);

  /* Canonical */
  var canonicalLink = document.createElement("link");
  canonicalLink.setAttribute("rel", "canonical");
  canonicalLink.setAttribute("href", canonical);

  head.insertBefore(canonicalLink, head.firstChild);
  head.insertBefore(mdes, head.firstChild);
  head.insertBefore(titleEl, head.firstChild);
}

export const REGISTER =
  "https://www.codere.mx/registro-deportes?clientType=sportsbook";
