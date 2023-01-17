let plugins = [];
if (process.env['NODE_ENV'] === 'test') {
    plugins = ['@babel/plugin-transform-modules-commonjs'];
}

module.exports = { plugins };
