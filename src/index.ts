import * as DeprecatedLogger from './Logger.js';
import * as SkeletonClient from './SkeletonClient.js';

/**
 * @deprecated Use the logger provided by SkeletonClient instead.
 */
export const logger = DeprecatedLogger;

/**
 * @deprecated Use SkeletonClient instead.
 */
export const ZPTXClient = SkeletonClient;

export * from './SkeletonClient.js';
