const { argv } = require('node:process');
const { crawlPage } = require("./crawl");

function printReport(pageCounts) {
  const pageCountArray = Object.entries(pageCounts);
  pageCountArray.sort((a, b) => {
    return b[1] - a[1];
  })
  const pageCountText = pageCountArray.map(page => `Found ${page[1]} internal links to ${page[0]}`).join('\n');
  console.log(pageCountText);
}

async function main() {
  console.log(argv)
  if (argv.length !== 3) {
    throw new Error("Incorrect arguments");
  }
  console.log('Searching:', argv[2]);
  const pages = {};
  const urls = await crawlPage(argv[2], argv[2], pages);
  printReport(urls);
}

main();