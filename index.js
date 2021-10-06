const puppeteer = require('puppeteer');
let urlList = [];

async function getAnchors(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(error => error);
  const getData = async () => {
    return await page.evaluate(() => {
      let anchors = document.querySelectorAll('a');
      let internalUrls = []
      for (let index = 0; index < anchors.length; index++) {
        const href = anchors[index].getAttribute("href");
        internalUrls.push(href);
      }
      return internalUrls;
    });
  }
  provisionalUrls = await getData();
  console.log(provisionalUrls)
  await browser.close();
  return provisionalUrls
}

async function updatePageList(urlList) {
  let domain = 'https://www.fxstreet.com';
  for (let i = 0; i < urlList.lupdatePageListength; i++) {
    href = urlList[i];
    if (href) {
      if (/^\//.test(href)) {
        href = domain + href;
      }
      console.log(typeof href);
      if (href.includes("?")) {
        href = href.slice(0, href.indexOf("?"));
      }
      if (href.includes("#")) {
        href = href.slice(0, href.indexOf("#"));
      }
      const found = urlList.some(el => el.href === href);
      const isFxstreetDomain = /^https:\/\/www.fxstreet.com/.test(href)
      if (!found && isFxstreetDomain) urlList.push({ visited: false, href: href });
    }
  }
}

async function getUnvisitedUrl() {
  var unvisitedUrls = urlList.filter(obj => {
    return obj.visited === false
  })
  console.log(unvisitedUrls[0]);
  return unvisitedUrls ? unvisitedUrls[0] : false;
}

async function scrapp(url = 'https://www.fxstreet.com/') {
  let provisionalUrlList = await getAnchors(url);
  await updatePageList(provisionalUrlList);
  let unvisitedUrl = await getUnvisitedUrl();
  console.log('unvisitedUrl',unvisitedUrl);
  if (unvisitedUrl) { scrapp(unvisitedUrl); } else { console.log('end'); }
}

(async () => {
  await scrapp();
})().catch(err => console.log(err));