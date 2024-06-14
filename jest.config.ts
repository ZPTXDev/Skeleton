import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(t|j)sx?$': '@swc/jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*/llhttp\\.wasm\\.js)$': '$1',
        'magic-bytes.js': 'magic-bytes.js',
        'discord.js': 'discord.js',
        '(.+)\\.js': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: ['node_modules/(?!(@zptxdev/zptx-lib|lodash-es))'],
};
export default config;
