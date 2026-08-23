/**
 * Every style, side by side — for tests only.
 *
 * Importing all styles at once is exactly what a consumer should never do, so
 * this file is not exported from the package. It exists so the suites below
 * can assert that the styles behave identically, which is the whole promise:
 * pick a look, get the same component.
 */
import * as matte from './matte/index.js';
import * as paper from './paper/index.js';
import * as sprout from './sprout/index.js';

export const STYLES = [
	['matte', matte],
	['paper', paper],
	['sprout', sprout]
] as const;

export type StyleModule = (typeof STYLES)[number][1];
