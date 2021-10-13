const axios = require('axios').default;
const cheerio = require('cheerio');
const elementToSearch = '.sticky';

let urlList = [{ visited: false, href: 'https://www.fxstreet.com/' }];

async function getHtmlData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const anchors = [];

    $('a').each((_idx, el) => {
      const anchor = $(el).attr('href')
      anchors.push(anchor);
    });

    console.log($(elementToSearch).lenght)
    
    const found = false; 
    return { hrefs: anchors, found: 0 };
  } catch (error) {
    throw error;
  }
}

async function updatePageList(hrefList) {
  let domain = 'https://www.fxstreet.com';
  for (let i = 0; i < hrefList.length; i++) {
    href = hrefList[i];
    if (href) {
      if (/^\//.test(href)) {
        href = domain + href;
      }
      if (href.includes("?")) {
        href = href.slice(0, href.indexOf("?"));
      }
      if (href.includes("#")) {
        href = href.slice(0, href.indexOf("#"));
      }
      const found = urlList.some(el => el.href === href);
      const isFxstreetDomain = /^https:\/\/www.fxstreet.com/.test(href)
      console.log('found',found,'isFxstreetDomain',isFxstreetDomain);
      if (!found && isFxstreetDomain) { urlList.push({ visited: false, href: href }); }
    }
  }
}

async function getUnvisitedUrl() {
  return urlList.find(obj => !obj.visited);
}

async function scrapp() {
  let unvisitedUrlObj = await getUnvisitedUrl();
  let unvisitedUrl = unvisitedUrlObj.href;
  console.log('unvisited url item', unvisitedUrl);
  if (unvisitedUrl) {
    let outputData = await getHtmlData(unvisitedUrl);
    if (outputData.found > 0) console.log('class found on: ', url);
    urlList.map(url => url.href === unvisitedUrl ? { href: unvisitedUrl, visited: true } : url);
    await updatePageList(outputData.hrefs);
    scrapp();
  } else {
    console.log('end');
  }
}

(async () => {
  await scrapp();
})().catch(err => console.log(err));