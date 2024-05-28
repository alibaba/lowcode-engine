import type { Spec, PlainObject } from '@alilc/lowcode-shared';
import type { PathParserOptions } from './utils/path-parser';

export type RawRouteLocation = Spec.RawRouteLocation;
export type RouteLocation = Spec.RouteLocation;
export type RawLocation = Spec.RawLocation;
export type RawLocationOptions = Spec.RawLocationOptions;

export interface RouteRecord extends Spec.RouteRecord, PathParserOptions {
  meta?: PlainObject;
  redirect?:
    | string
    | RawRouteLocation
    | ((to: RouteLocationNormalized) => string | RawRouteLocation);
  children?: RouteRecord[];
}

export interface RouteLocationNormalized extends RouteLocation {
  matched: RouteRecord[];
}
