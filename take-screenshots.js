const puppeteer = require('puppeteer');
const path = require('path');

const sites = [
  {
    name: 'nightandday',
    label: 'Night & Day Pizzeria',
    city: 'Nis',
    localPath: path.resolve('C:/WebBuisnis/Nis/01-NightAndDay-Pizzeria/index.html'),
    liveUrl: 'https://nightandday.rs/'
  },
  {
    name: 'jskm',
    label: 'JSKM Advokati',
    city: 'Nis',
    localPath: path.resolve('C:/WebBuisnis/Nis/04-JSKM-Advokati/index.html'),
    liveUrl: 'https://jskm.rs/'
  },
  {
    name: 'studiojasna',
    label: 'Studio Jasna',
    city: 'Beograd',
    localPath: path.resolve('C:/WebBuisnis/Bg/06-StudioJasna/index.html'),
    liveUrl: 'https://www.salonjasna.com/'
  },
  {
    name: 'danilovic',
    label: 'Auto Servis Danilovic',
    city: 'Novi Sad',
    localPath: path.resolve('C:/WebBuisnis/Ns/10-AutoServisDanilovic/index.html'),
    liveUrl: 'https://autoservisnovisad.rs/'
  },
  {
    name: 'drkalem',
    label: 'Dr Kalem Stomatolog',
    city: 'Novi Sad',
    localPath: path.resolve('C:/WebBuisnis/Ns/15-DrKalemStomatolog/index.html'),
    liveUrl: 'https://www.drkalem.rs/'
  }
];

async function main() {
  const browser = await puppeteer.launch({ headless: true });

  for (const site of sites) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Screenshot "BEFORE" — their current live website
    console.log(`[BEFORE] ${site.label} — ${site.liveUrl}`);
    try {
      await page.goto(site.liveUrl, {
        waitUntil: 'networkidle2',
        timeout: 20000
      });
      await new Promise(r => setTimeout(r, 2000));

      await page.screenshot({
        path: path.join(__dirname, 'img', `before-${site.name}.png`),
        clip: { x: 0, y: 0, width: 1440, height: 900 }
      });
      console.log(`  -> img/before-${site.name}.png`);
    } catch (err) {
      console.error(`  Error (before): ${err.message}`);
    }
    await page.close();

    // Screenshot "AFTER" — our redesign (local file)
    const page2 = await browser.newPage();
    await page2.setViewport({ width: 1440, height: 900 });

    console.log(`[AFTER]  ${site.label} — local file`);
    try {
      await page2.goto('file:///' + site.localPath.replace(/\\/g, '/'), {
        waitUntil: 'networkidle2',
        timeout: 15000
      });
      await new Promise(r => setTimeout(r, 1500));

      await page2.screenshot({
        path: path.join(__dirname, 'img', `portfolio-${site.name}.png`),
        clip: { x: 0, y: 0, width: 1440, height: 900 }
      });
      console.log(`  -> img/portfolio-${site.name}.png`);
    } catch (err) {
      console.error(`  Error (after): ${err.message}`);
    }
    await page2.close();
  }

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
