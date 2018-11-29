const path = require('path');

const resolve = src => path.resolve(__dirname, '../', src);

module.exports = {
    src: resolve('src'),
    core: resolve('src/core'),
    lib: resolve('src/lib')
};
