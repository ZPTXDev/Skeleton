import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*/llhttp\\.wasm\\.js)$': '$1',
        'discord.js': 'discord.js',
        '(.+)\\.js': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
    transformIgnorePatterns: ['node_modules/(?!(@zptxdev/zptx-lib|lodash-es))'],
};
export default config;
