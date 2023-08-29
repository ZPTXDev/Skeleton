import * as Logger from './Logger.js';
/**
 * @deprecated Use the logger provided by SkeletonClient instead.
 */
const DeprecatedLogger = Logger;
export * from './SkeletonClient.js';
export { DeprecatedLogger as Logger };
