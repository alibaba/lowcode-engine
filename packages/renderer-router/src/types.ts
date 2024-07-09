import type { RouteRecord as SpecRouteRecord, StringDictionary } from '@alilc/lowcode-shared';
import type { PathParserOptions } from './utils/path-parser';

import {
  RawRouteLocation,
  RouteLocation,
  RawLocation,
  RawLocationOptions,
} from '@alilc/lowcode-shared';

export { RawRouteLocation, RouteLocation, RawLocation, RawLocationOptions };

export interface RouteRecord extends SpecRouteRecord, PathParserOptions {
  meta?: StringDictionary;
  redirect?:
    | string
    | RawRouteLocation
    | ((to: RouteLocationNormalized) => string | RawRouteLocation);
  children?: RouteRecord[];
}

export interface RouteLocationNormalized extends RouteLocation {
  matched: RouteRecord[];
}
