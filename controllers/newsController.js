const News = require('../models/news');

module.exports.all_news = async (ctx) => {
    let result = await News.find().sort({ createdAt: -1 })

    try {
        await ctx.render('news', { news: result });
    } catch (e) {
        console.log(e);
    }
}

module.exports.create_news = async (ctx) => {
    const news = News(ctx.request.body);
    await news.save();

    try {
        await ctx.redirect('/news');
    } catch (e) {
        console.log(e);
    }
}