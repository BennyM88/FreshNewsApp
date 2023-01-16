const User = require('../models/user');

// handle errors
const handleErrors = (e) => {
    let errors = { email: '', password: '' };

    // duplicate email error
    if (e.code === 11000) {
        errors.email = 'That email already exists';
        return errors;
    }

    // validation errors
    if (e.message.includes('user validation failed')) {
        Object.values(e.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

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
        ctx.status(201).json(user);
    }
    catch (e) {
        const errors = handleErrors(e);
        ctx.status(400).json({ errors });
    }
}

module.exports.login_post = async (ctx) => {
    await ctx.body('login');
}