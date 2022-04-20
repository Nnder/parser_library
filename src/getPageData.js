const puppeteer = require('puppeteer');


async function getPageData(urls, func) {
    const browser = await puppeteer.launch();
    let arr = [];

    for(let i = 0; i<= urls.length-1; i++){
        const page = await browser.newPage();
        await page.goto(urls[i]);
        await page.bringToFront();
        await page.waitForTimeout(2000);

        let numberOfComments = await page.evaluate(()=> document.querySelector('.infobox_heading > h3:nth-child(1)').innerText.split(' ')[2]);

        if(numberOfComments > 10){
            try {
                await page.waitForSelector('#load_more_comments');
                for(let i = 10; i<= ~~numberOfComments; i+=10){
                await page.click('#load_more_comments');
                await page.waitForTimeout(5000)
            }
            } catch (error) {
                console.log(numberOfComments);
            }
        }

        arr.push(func(page))

        await page.close();
    }   
    await browser.close();

    return arr
}



module.exports = {
    getPageData
};
