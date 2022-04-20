const puppeteer = require('puppeteer');


async function getPageData(urls) {
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

        arr.push({
            'location': await page.$eval('span.location:nth-child(1) > a:nth-child(2)', el=>el.innerText),
            'photo': await page.evaluate(()=> document.querySelector('.imgallery_bigimg').style.backgroundImage.slice(5, -2)),
            'description': await page.$eval('.main_article_text', el=>el.innerText),
            'category': await page.$eval('.breadcrumbs-list-wrap > li:nth-child(3) > a:nth-child(1)', el=>el.innerText) + '/' +
            await page.$eval('.breadcrumbs-list-wrap > li:nth-child(4) > a:nth-child(1)', el=>el.innerText),
            'type': await page.evaluate(()=>{
                const result = {}
                let elements = document.querySelectorAll('div.catmenu_item.selected');

                elements.forEach(element=>{
                    let underTypeArray = []
                    let underType = element.querySelectorAll('a.catmenu_subbtn.selected span.catmenu_btn_txt').forEach(elem=>underTypeArray.push(elem.innerText))
                    result[element.querySelector('.catmenu_btn_txt').innerText] = underTypeArray
                })

                return result
            }),
            'moreInfo': await page.evaluate(()=>[...document.querySelector('.guide_metabox.guide_metabox_smpl').querySelectorAll('.guide_metabox_item_main')]
                                                .map(elem=>elem.innerText)),
            'raiting': await page.$eval('span.rating_num_total',el=>el.innerText),
            'score': await page.evaluate(()=> document.querySelector('.gv_rating_total > small:nth-child(2)').innerText.split(' ')[1]),
            'visited': await page.evaluate(()=> [...document.querySelectorAll('div.users_column:nth-child(1) > a')].filter((el)=>el.innerText)[0].innerText ),
            'willVisit': await page.evaluate(()=> [...document.querySelectorAll('div.users_column:nth-child(2) > a')].filter((el)=>el.innerText)[0].innerText ),
            'favorite': await page.evaluate(()=> [...document.querySelectorAll('div.users_column:nth-child(3) > a')].filter((el)=>el.innerText)[0].innerText ),
            'numberOfComments': numberOfComments,
            'comments': await page.evaluate(async ()=>{
                    const comments_list = []
                    let btn_load = document.querySelector('#load_more_comments');
                    let comments = document.querySelectorAll('div.comment');

                    comments.forEach(comment=>{
                        comments_list.push({
                            "name": comment.querySelector('.wreview_username').innerText,
                            "timestamp": comment.querySelector('.review_timestamp').innerText,
                            "text": comment.querySelector('.comment_text_wrap > p').innerText,
                        })
                    })

                    return comments_list
            }),
            'coordinates': await page.evaluate(()=> document.querySelector('.info_list > li:nth-child(2)').innerText)
        })

        await page.close();
    }   
    await browser.close();

    return arr
}



module.exports = {
    getPageData
};
