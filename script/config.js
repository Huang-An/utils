const path = require('path');
const buble = require('rollup-plugin-buble');
const eslint = require('rollup-plugin-eslint');
const alias = require('rollup-plugin-alias');
const aliases = require('./alias');

const banner = '/*!\n' +
    ` * utils.js\n` +
    ` * By huangAn\n` +
    ' */';

const resolve = src => {
    const base = src.split('/')[0];
    return aliases[base]
        ? path.resolve(aliases[base], src.slice(base.length + 1))
        : path.resolve(__dirname, '../', src);
};

const builds = {
    'dev': {
        entry: resolve('src/core/listener.js'),
        dest: resolve('dist/utils.js'),
        moduleName: "utils",
        format: 'umd',
        alias: {},
        banner
    },
};

function getConfig(name) {

    const opts = builds[name];

    return {
        input: opts.entry,
        plugins: [
            eslint.eslint({
                exclude: 'dist'
            }),
            buble(),
            alias(Object.assign({}, aliases, opts.alias))
        ],
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'utils'
        },
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg);
            }
        }
    };
}

module.exports = getConfig;
