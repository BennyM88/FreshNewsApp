const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const ejs = require('@koa/ejs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/config');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const { ensureAuthenticated, checkUser } = require('./middleware/authMiddleware');

// koa app & router
const app = new Koa();
const router = new Router();

// connect to mongodb
mongoose.set('strictQuery', false);
mongoose.connect(config.dbURI)
    .then(_ => app.listen(3000))
    .catch(e => console.log(e));

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
    .use(json())
    .use(router.routes())
    .use(newsRoutes.routes())
    .use(authRoutes.routes())
    .use(router.allowedMethods())
    .use(serve(path.join(__dirname, 'styles')))
    .use(ctx => {
        if (404 != ctx.status) return;
        ctx.redirect('/not-found');
    });

// basic routes
router.get('/', checkUser, async (ctx) => {
    await ctx.render('home');
});

router.get('/about', checkUser, async (ctx) => {
    await ctx.render('about');
});

router.get('/create', ensureAuthenticated, checkUser, async (ctx) => {
    await ctx.render('create');
});

router.get('/not-found', async (ctx) => {
    ctx.status = 404;
    await ctx.render('404');
})