const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

(async () => {
    const station = process.env.STATION;
    const wfo = process.env.WFO
    const gridX = process.env.GRIDX
    const gridY = process.env.GRIDY
    try {
        const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser'});
        const page = await browser.newPage();
        await page.goto(`file:${path.join(__dirname, `index.html?station=${station}&wfo=${wfo}&gridx=${gridX}&gridy=${gridY}`)}`, {waitUntil: 'networkidle0'});
        await page.content();
        await page.evaluateHandle('document.fonts.ready');
        await page.waitForSelector('div.canvas-ready');

        const screen = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
        fs.writeFileSync(path.resolve('./screen.png'), screen.replace(/^data:image\/png;base64,/, ""), 'base64');

        const imp = exec(`convert screen.png -dither none -remap palette.gif -rotate "90" display.png`);
        if (process.env.OUTPUT_DIR) {
            const mvp = exec(`mv ./display.png ${process.env.OUTPUT_DIR}`);
        }
        process.exit();
    } catch (e) {
        console.error(e.message)
    }
})();