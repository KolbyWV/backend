
//necessary for scrape
const axios = require('axios');
const cheerio = require('cheerio');
const models = require('../models')

//urls of manga sites
const readm = 'https://readm.org'
const zeroscans = 'https://zeroscans.com'
const mangadex = 'https://mangadex.org'
const isekaiscans = 'https://isekaiscan.com'

//data sources and data builder
const getZeroScans = async () => {
    try {
        const { data} = await axios.get(zeroscans);
        const $ = cheerio.load(data);
        const zeros = $('.col-12, .col-md-6, .col-xl-3 > .list-item')

        const raws = []
        const updates = []
        const duplicates = []

        zeros.each(function(index, zero) {
            let title = $(this).find('.list-content > .list-body > a').text();
                title = title.replace(/\s/g,' ').trim()
            let url = $(this).find('.list-content > .list-body > a').attr('href');
            let img = $(this).find('.media-comic-card > a').attr('style');
                img = zeroscans+img.replace('url(','').replace('background-image:','').replace(')','').replace(/\"/gi, '').replace(';height: 100%;','');
            let time = $(this).find('.list-content > .list-footer > .text-muted').html();
                time = time.replace('<i class=\"far fa-clock mr-1\"></i>','').replace(/\s/g, ' ').trim()
            let chapter = $(this).find('.media-comic-card > .d-flex > a > span').html();
                if (chapter !== null) {chapter = chapter.replace(/\s/g,' ').trim()}
            let chapterUrl = $(this).find('.media-comic-card > a').attr('href');
            const source = 'Zero Scans';


        raws.push({title, url, img, time, chapter, chapterUrl, source})
        });

        for ( i = 0; i < 16; i += 2) {
            updates.push(raws[i]);
            raws[i+1] && duplicates.push(raws[i + 1]);

        }
        return updates;
    } catch (error){
        throw error;
    }
};
const getReadM = async () => {
    try {
        const { data } = await axios.get(readm);
        const $ = cheerio.load(data);

        const mangas = $('ul.latest-updates > li.segment-poster-sm > .poster')
        const updates = []

        mangas.each(function(index, manga) {

            let title = $(this).find('.poster-subject > h2.truncate > a').html();
            let url = readm+$(this).find('.poster-subject > h2.truncate > a').attr('href');
            var img = readm+$(this).find('img.lazy-wide').attr('data-src');
            let time = $(this).find('date.toda2y').text();
            let chapter = $(this).find('ul.chapters > li > a').html();
            let chapterUrl = readm+$(this).find('.poster-subject > ul.chapters > li > a').attr('href');
            const source = 'ReadM';

            if (!title.includes(' Manga Chapter') && chapter !== null && chapterUrl !== undefined) {updates.push({title, url, img, time, chapter, chapterUrl, source})}

        });

        return updates;
    } catch (error){
        throw error;
    }
};
const getMangaDex = async () => {
    try {
        const { data } = await axios.get(mangadex);
        const $ = cheerio.load(data);

        const mangas = $('#latest_update > .row > .p-2')
        const updates = []

        mangas.each(function(index, manga) {

            let title = $(this).find('.d-flex > a.manga_title').attr('title');
            let url = mangadex+$(this).find('.d-flex > a.manga_title').attr('href');
            let img = $(this).find('.mr-2 > a > img').attr('src');
            let time = 'Just Updated'  //defaulted update timestamp
            let chapter = $(this).find('.py-0 > a').html();
            var chapterUrl = mangadex+$(this).find('.py-0 > a').attr('href');
            const source = 'MangaDex';

            updates.push({title, url, img, time, chapter, chapterUrl, source})
        });

        return updates;
    } catch (error){
        throw error;
    }
};
const getIsekaiScans = async () => {
    try {
        const { data } = await axios.get(isekaiscans);
        const $ = cheerio.load(data);
        const mangas = $('.page-item-detail')
        const updates = []

        mangas.each(function(index, manga) {
            let title = $(this).find('h3.h5 > a').html();
            let url = $(this).find('h3.h5 > a').attr('href');
            let img = $(this).find('.item-thumb > a > img').attr('data-src');
            let time = $(this).find('.list-chapter > .chapter-item > span.post-on').html();
                time = time.trimLeft(18).trimRight(18)
            let chapter = $(this).find('.list-chapter > .chapter-item > span.chapter > a').html();
                chapter = chapter.replace('chapter ','').replace(/\s/g, ' ').trim()
            let chapterUrl = $(this).find('.list-chapter > .chapter-item > span.chapter > a').attr('href');
            const source = 'Isekai Scan';

            updates.push({title, url, img, time, chapter, chapterUrl, source})
        });

        return updates;
    } catch (error){
        throw error;
    }
};
// pull all the data together and save
const asyncScrape = async () => {
    const zero = await getZeroScans();
    const read = await getReadM();
    const dex = await getMangaDex();
    const isekai = await getIsekaiScans();
    let updates = zero.concat(read).concat(dex).concat(isekai);
    return saveData(updates)

}
// saves to the database and drops the table
const saveData = (updates) => {
    models.Update.sync({force: true}).then(function (){
        updates.map(update => models.Update.create({
            title: update.title,
            url: update.url,
            img: update.img,
            time: update.time,
            chapter: update.chapter,
            chapterUrl: update.chapterUrl,
            source: update.source
        }))
    });
}

module.exports = {asyncScrape}
