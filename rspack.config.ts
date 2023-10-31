import { Configuration } from '@rspack/cli';
import _ from 'lodash';
import { HtmlRspackPlugin } from '@rspack/core';

const entry = {
    lottery: './app/lottery.ts',
    register: './app/register.tsx',
};

const config: Configuration = {
    entry,
    plugins: [
        ..._.keys(entry).map(ent => new HtmlRspackPlugin({
            template: `./app/public/${ent}.html`,
            filename: `./${ent}.html`,
            chunks: [ent],
            minify: true,
            inject: true,
        })),
    ],
};

export default config;
