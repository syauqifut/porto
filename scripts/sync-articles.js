require("dotenv").config();

const fs = require("fs");
const path = require("path");

const mediumUsername = process.env.MEDIUM_USERNAME || "";
const RSS_URL = `https://medium.com/feed/@${mediumUsername}`;
const OUTPUT_PATH = path.join(__dirname, "../public/assets/data/article.json");
const BACKUP_PATH = path.join(__dirname, "../public/assets/data/article.backup.json");

async function fetchRSS() {
  const res = await fetch(RSS_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: ${res.status}`);
  }

  return await res.text();
}

function cleanLink(url) {
    if (!url) return "#";
  
    return url.split("?")[0];
  }
  
function cleanExcerpt(html, maxLength = 220) {
  if (!html) return "";

  let text = html.replace(/<[^>]*>/g, "");

  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  text = text.replace(/\s+/g, " ").trim();

  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + "...";
  }

  return text;
}

function parseRSS(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.map((item) => {
    const content = item[1];

    const title =
      content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
      content.match(/<title>(.*?)<\/title>/)?.[1] ||
      "Untitled";

    const link = content.match(/<link>(.*?)<\/link>/)?.[1] || "#";

    const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1];

    const description =
      content.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/)?.[1] ||
      content.match(/<content:encoded>(.*?)<\/content:encoded>/)?.[1] ||
      "";

    return {
      title: title.trim(),
      link: cleanLink(link),
      date: pubDate ? new Date(pubDate).toISOString() : null,
      excerpt: cleanExcerpt(description),
    };
  });
}

function saveJSON(data) {
  if (!data || data.length === 0) {
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
}

async function main() {
  if (!mediumUsername.trim()) {
    console.error("sync-articles: MEDIUM_USERNAME is not set (check .env)");
    process.exit(1);
  }

  try {
    const xml = await fetchRSS();
    const articles = parseRSS(xml);

    saveJSON(articles);
  } catch (err) {
    if (fs.existsSync(BACKUP_PATH)) {
      fs.copyFileSync(BACKUP_PATH, OUTPUT_PATH);
    }
  }
}

main();
