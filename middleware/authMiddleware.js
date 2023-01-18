const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

async function ensureAuthenticated(ctx, next) {
    const token = ctx.cookies.get('jwt');

    if (token) {
        try {
            let decoded = jwt.verify(token, config.jwtKey);
            console.log(decoded);
            await next();
        } catch (error) {
            ctx.redirect('/login');
        }
    } else {
        ctx.redirect('/login');
    }
};

async function checkUser(ctx, next) {
    const token = ctx.cookies.get('jwt');

    if (token) {
        try {
            let decoded = jwt.verify(token, config.jwtKey);
            let user = await User.findById(decoded.id);
            ctx.state.user = user;
            await next();
        } catch (error) {
            ctx.state.user = null;
            await next();
        }
    } else {
        ctx.state.user = null;
        await next();
    }
};

module.exports = { ensureAuthenticated, checkUser };