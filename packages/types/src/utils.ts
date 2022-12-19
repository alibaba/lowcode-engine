import { NpmInfo } from './npm';
import { JSExpression, JSFunction } from './value-type';

export type InternalUtils = {
  name: string;
  type: 'function';
  content: JSFunction | JSExpression;
};

export type ExternalUtils = {
  name: string;
  type: 'npm' | 'tnpm';
  content: NpmInfo;
};

export type UtilItem = InternalUtils | ExternalUtils;
export type UtilsMap = UtilItem[];

type FilterOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? K : never;
    }[keyof T],
    undefined
  >
>;

type FilterNotOptional<T> = Pick<
  T,
  Exclude<
    {
      [K in keyof T]: T extends Record<K, T[K]> ? never : K;
    }[keyof T],
    undefined
  >
>;

type PartialEither<T, K extends keyof any> = { [P in Exclude<keyof FilterOptional<T>, K>]-?: T[P] } &
  { [P in Exclude<keyof FilterNotOptional<T>, K>]?: T[P] } &
  { [P in Extract<keyof T, K>]?: undefined };

type Object = {
  [name: string]: any;
};

export type EitherOr<O extends Object, L extends string, R extends string> =
  (
    PartialEither<Pick<O, L | R>, L> |
    PartialEither<Pick<O, L | R>, R>
  ) & Omit<O, L | R>;
