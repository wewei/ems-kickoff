import { Configuration } from '@rspack/cli';
import _ from 'lodash';
import { HtmlRspackPlugin } from '@rspack/core';

const entry = {
    lottery: './app/lottery/index.js',
    register: './app/register/index.tsx',
    admin: './app/admin/index.tsx',
};

const config: Configuration = {
    entry,
    builtins: {
        copy: {
            patterns: [{
                from: './app/lottery/lib',
                to: './lottery/lib',
            }, {
                from: './app/lottery/assets',
                to: './lottery/assets',
            }, {
                from: './app/register/assets',
                to: './register/assets',
            }],
        },
    },
    plugins: [
        ..._.keys(entry).map(ent => new HtmlRspackPlugin({
            template: `./app/${ent}/index.html`,
            filename: `./${ent}/index.html`,
            chunks: [ent],
            minify: true,
            inject: true,
        })),
    ],
};

export default config;
