const {getPageData} = require('./src/getPageData');
const puppeteer = require('puppeteer');

const urls = [
    'https://opoznai.bg/view/orlovo-oko-iagodina',
    // 'https://opoznai.bg/view/etnografski-kompleks-damastzena',
    // 'https://opoznai.bg/view/chudnite-mostove',
    // 'https://opoznai.bg/view/ekopateka-iskar-panega',
    // 'https://opoznai.bg/view/ekopateka-diavolskata-pateka',
    // 'https://opoznai.bg/view/krushunski-vodopadi',
    // 'https://opoznai.bg/view/peshterata-diavolskoto-garlo',
    // 'https://opoznai.bg/view/vodopad-skoka-kaleitza',
    // 'https://opoznai.bg/view/vilno-selishte-azareia',
    // 'https://opoznai.bg/view/vodopad-orfei-i-kaniona-na-vodopadite-smolian',
    // 'https://opoznai.bg/view/ekopateka-pateka-na-zdraveto-bankia',
    // 'https://opoznai.bg/view/iazovir-vacha',
    // 'https://opoznai.bg/view/vodopad-zlaten-vodopad',
    // 'https://opoznai.bg/view/natzionalen-park-pirin',
    // 'https://opoznai.bg/view/banderishki-ezera-muratovo-ezero',
    // 'https://opoznai.bg/view/zookat-alis',
    // 'https://opoznai.bg/view/sedemte-rilski-ezera',
    // 'https://opoznai.bg/view/kleptuza',
    // 'https://opoznai.bg/view/trigradsko-jdrelo',
    // 'https://opoznai.bg/view/vodopad-liastovichi-vir-ili-vodopad-na-liastovitzite',
    // 'https://opoznai.bg/view/delfinarium-varna',
    // 'https://opoznai.bg/view/peshterata-snejanka',
    // 'https://opoznai.bg/view/zamakat-v-ravadinovo',
    // 'https://opoznai.bg/view/peshtera-prohodna',
    // 'https://opoznai.bg/view/ekopateka-biala-reka-kalofer',
    // 'https://opoznai.bg/view/vrah-snejanka-pamporovo',
    // 'https://opoznai.bg/view/vodopad-raisko-praskalo',
    // 'https://opoznai.bg/view/baikushevata-mura',
    // 'https://opoznai.bg/view/ekoselishte-omaia',
    // 'https://opoznai.bg/view/krepostta-tzarevetz',
    // 'https://opoznai.bg/view/emenski-kanion',
    // 'https://opoznai.bg/view/krepost-tzari-mali-grad-belchin',
    // 'https://opoznai.bg/view/ekopateka-beli-iskar',
    // 'https://opoznai.bg/view/velianova-kashta-grad-bansko',
    // 'https://opoznai.bg/view/vodopad-vidimsko-praskalo-vidima',
    // 'https://opoznai.bg/view/krepost-ovech-provadiia',
    // 'https://opoznai.bg/view/muzei-neofit-rilski-grad-bansko',
    // 'https://opoznai.bg/view/kamennite-kashti-krai-karlukovo',
    // 'https://opoznai.bg/view/park-za-tantzuvashti-mechki-belitza',
    // 'https://opoznai.bg/view/postoianna-ikonna-izlojba-banska-hudojestvena-shkola',
    // 'https://opoznai.bg/view/iagodinska-peshtera',
    // 'https://opoznai.bg/view/peshtera-orlova-chuka',
    // 'https://opoznai.bg/view/bekovi-skali',
    // 'https://opoznai.bg/view/ekopateka-pod-praskite-na-vodopada-teteven',
    // 'https://opoznai.bg/view/nos-emine-prirodna-zabelejitelnost'
]

const getData = async (page)=>{
    return {
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
    }
}

getPageData(urls, getData).then(data=>console.log(data))

// getPageData(urls).then(data=>saveFile(data))