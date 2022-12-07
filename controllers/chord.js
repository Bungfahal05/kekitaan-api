const puppeteer = require('puppeteer')

exports.newChord = (async(req, res) => {

    async function start() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
    
        await page.goto('https://www.chordindonesia.com');
        // await page.goto('https://www.chordindonesia.com/worid-feat-fara-dilamun-rindu');
    
    
        const newChord = await page.$$eval('.widget > ul > li > a', item => {
            return item.map(x => ({
                title: x.innerText,
                href: x.getAttribute('href') 
            }))
        })
    
        res.status(200).json(newChord);
        
        await browser.close();
    }
    
    start()
})


exports.categoryAZ = (async(req, res) => {

    async function start() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
    
        await page.goto(`https://www.chordindonesia.com/${req.params.id}`);
    
        const category = await page.$$eval('.entry-content > ul > li > a', item => {
            return item.map(x => ({
                title: x.innerText,
                href: x.getAttribute('href')
            }))
        })
        
        res.status(200).json(category);
        
        await browser.close();
    }
    
    start()
})


exports.byArtist = (async(req, res) => {

    const {body} = req.body

    async function start() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
    
        await page.goto(`${body.href}`);
    
        const song = await page.$$eval('.entry-content > ul > li > a', item => {
            return item.map(x => ({
                title: x.innerText,
                href: x.getAttribute('href')
            })) 
        })
        
        res.status(200).json(song);
        
        await browser.close();
    }
    
    start()
})


// exports.byLyrics = (async(req, res) => {

//     async function start() {
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox']
//         });
//         const page = await browser.newPage();
    
//         await page.goto(`${req.body.href}`);
    
//         // const contentAll = await page.$eval('pre', el => el.textContent)
//         const content = await page.$$eval('pre > a', el => el.textContent)

//         const allcontent = await page.evaluate(() => 
//         Array.from(document.querySelectorAll('pre'), 
//         e => e.outerHTML))

//         const chord = await page.evaluate(() => 
//         Array.from(document.querySelectorAll('pre'), 
//         e => e.querySelector(':not(a)').innerText));

//         // const rem = allcontent.querySelector(':not(a)')
//         // const stringChord = chord.toString()
//         // const stringAll = allcontent.toString()

        
//         // console.log(rem, 'allcontent')
//         console.log(chord, 'chord')

//         // const newstring = stringAll.replaceAll("love", "jancuk")

//         // console.log(newstring, 'stringAll')

//         res.status(200).json({
//             title : req.body.title,
//             content : allcontent.toString()
//         });
        
//         await browser.close();
//     }
    
//     start()
// })


exports.bySong = (async(req, res) => {

    const url = await req.body.body.href 

    if(req.body.body.href === undefined) {
        res.status(400).json("Error")
    } else {
        async function start() {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox']
            });
            const page = await browser.newPage();
            
            const arraySong = []
        
            await page.goto(url);
    
            await page.click("#lirik")

            await page.screenshot({ path: 'first.png', fullPage: true  })

            const original = await page.$eval('pre', el => el.textContent)

            arraySong.push({
                original : original
            })

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus1 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_one : contentPlus1
            })

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus2 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_two : contentPlus2
            })


            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus3 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_three : contentPlus3
            })
    

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus4 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_four : contentPlus4
            })

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus5 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_five : contentPlus5
            })

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus6 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_six : contentPlus6
            })

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus7 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_seven : contentPlus7
            })           
    
            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus8 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_eight : contentPlus8
            })  

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus9 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_nine : contentPlus9
            })  

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus10 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_ten : contentPlus10
            })  

            await page.evaluate(() => {
                document.querySelector('#transposeplus').click();
            });

            const contentPlus11 = await page.$eval('pre', el => el.textContent)
            arraySong.push({
                transpose_eleven : contentPlus11
            })  

            res.status(200).json({
                title: req.body.body.title,
                content : arraySong
            });
            
            await browser.close();
        }
        
        start()
    }

})