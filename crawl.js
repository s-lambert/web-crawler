const { JSDOM } = require('jsdom');

function normalizeURL(url) {
  const parsed = new URL(url);
  const path = parsed.pathname.endsWith("/") ? parsed.pathname.replace(/\/ $/, "") : parsed.pathname;
  return `${parsed.protocol}//${parsed.hostname}${path}`;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody)
  const anchors = dom.window.document.querySelectorAll('a')
  const urls = new Set();
  const sanitisedBase = normalizeURL(baseURL);
  for (let anchor of anchors) {
    try {
      if (anchor.href.startsWith("/")) {
        const sanitised = normalizeURL(sanitisedBase + anchor.href.replace(/^\//, ""));
        urls.add(sanitised);
      }
    } catch (_) {
    }
  }
  return Array.from(urls);
}

async function crawlPage(baseUrl, currentUrl, pages) {
  if (!currentUrl.startsWith(baseUrl)) {
    return pages;
  }

  const normalized = normalizeURL(currentUrl);
  if (pages[normalized]) {
    pages[normalized] += 1;
    return pages;
  } else {
    pages[normalized] = 1;
  }

  try {
    const response = await fetch(normalized);
    if (response.status !== 200) {
      throw new Error('Could not fetch', normalized);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType.includes("text/html")) {
      throw new Error("Fetched non-HTML content, cannot crawl.");
    }
    const html = await response.text();
    const links = getURLsFromHTML(html, baseUrl);
    for (const link of links) {
      if (link.endsWith('.xml')) { continue; }
      await crawlPage(baseUrl, link, pages);
    }
  } catch (e) {
    console.log(e);
  }
  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};