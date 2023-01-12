const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-body-parser');
const ejs = require('@koa/ejs');
const path = require('path');
const mongoose = require('mongoose');
const News = require('./models/news');
const newsController = require('./controllers/newsController');
const config = require('./config/config');

// koa app & router
const app = new Koa();
const router = new Router();

// connect to mongodb
mongoose.set('strictQuery', false);
mongoose.connect(config.dbURI)
    .then(_ => app.listen(3000))
    .catch(err => console.log(err));

// register view engine
ejs(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
})

// middleware & static files
app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(path.join(__dirname, 'styles')))
    .use(ctx => {
        if (404 != ctx.status) return;
        ctx.redirect('/not-found');
    });

router.get('/', async (ctx) => {
    await ctx.redirect('/news');
});

router.get('/about', async (ctx) => {
    await ctx.render('about');
});

router.get('/create', async (ctx) => {
    await ctx.render('create');
});

router.get('/news', newsController.all_news);

router.post('/news', newsController.create_news);

router.get('/not-found', async (ctx) => {
    ctx.status = 404;
    await ctx.render('404');
})