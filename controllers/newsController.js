const News = require('../models/news');

const all_news = async (ctx) => {
    let result = await News.find().sort({ createdAt: -1 })

    try {
        await ctx.render('home', { news: result });
    } catch (e) {
        console.log(e);
    }
}

const create_news = async (ctx) => {
    const news = News(ctx.request.body);
    await news.save();

    try {
        await ctx.redirect('/news');
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    all_news,
    create_news
}