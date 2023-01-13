module.exports.signup_get = async (ctx) => {
    await ctx.render('home');
}

module.exports.login_get = async (ctx) => {
    await ctx.render('home');
}

module.exports.signup_post = async (ctx) => {
    await ctx.body('signup');
}

module.exports.login_post = async (ctx) => {
    await ctx.body('login');
}