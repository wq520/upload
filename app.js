const request = require('superagent')
const cheerio = require('cheerio')
const { join } = require('path')
const Koa = require('koa')
const app = new Koa
const url = 'https://www.shiguangkey.com/'
app.use(async ctx => {
    const arr = []
    const data = await new Promise(resolve => {
        request
            .post(url)
            .end((err, res) => {
                const data = res.text
                const $ = cheerio.load(data)
                $('.course-item').each((i, v) => {
                    const $v = $(v)
                    const obj = {
                        img: $v.find('img').prop('src'),
                        title: $v.find('a.ictxt').text().trim(),
                        num: Number.parseInt($v.find('a.item-txt').text().slice(5)),
                        src: join(url, $v.find('a.cimg').prop('href'))
                    }
                    arr.push(obj)
                })
                resolve(arr)
            })
        ctx.body = arr
    })
})

app.listen(3000)