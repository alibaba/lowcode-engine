import { type RouteSchema } from '@alilc/runtime-shared';
import { type ParsedQs } from 'qs';
import { type PathParserOptions } from './utils/path-parser';

export type RouteRecord = RouteSchema & PathParserOptions;

export type LocationQuery = ParsedQs;

export type RouteParams = Record<string, string | string[]>;
