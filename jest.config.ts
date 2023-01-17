import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.(j|t)sx?$': ['ts-jest', { useESM: true }],
	},
	moduleNameMapper: {
		'(.+)\\.js': '$1',
	},
	extensionsToTreatAsEsm: ['.ts'],
	transformIgnorePatterns: ['node_modules/(?!(@zptxdev))'],
};
export default config;
