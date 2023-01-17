const User = require('../models/user');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (e) => {
    let errors = { email: '', password: '' };

    if (e.code === 11000) {
        errors.email = 'That email already exists';
        return errors;
    }

    if (e.message.includes('user validation failed')) {
        Object.values(e.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// create json web token
const maxAge = 2 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, config.jwtKey, {
        expiresIn: maxAge
    });
};

module.exports.signup_get = async (ctx) => {
    await ctx.render('signup');
}

module.exports.login_get = async (ctx) => {
    await ctx.render('login');
}

module.exports.signup_post = async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        ctx.cookies.set('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        ctx.status = 201;
        ctx.body = { id: user._id };
    }
    catch (e) {
        const errors = handleErrors(e);
        ctx.status = 400;
        ctx.body = errors;
    }
}

module.exports.login_post = async (ctx) => {
    await ctx.body('login');
}