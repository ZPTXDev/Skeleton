import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
	},
	moduleNameMapper: {
		'(.+)\\.js': '$1',
	},
	extensionsToTreatAsEsm: ['.ts'],
	transformIgnorePatterns: ['/node_modules/(?!@zptxdev/zptx-lib)'],
};
export default config;
