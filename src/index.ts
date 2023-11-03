import { logger as DeprecatedLogger } from './Logger.js';
import { SkeletonClient } from './SkeletonClient.js';

/**
 * @deprecated Use the logger provided by SkeletonClient instead.
 */
export const logger = DeprecatedLogger;

/**
 * @deprecated Use SkeletonClient instead.
 */
export const ZPTXClient = SkeletonClient;

export * from './ModuleHandlers/index.js';
export * from './SkeletonClient.js';
