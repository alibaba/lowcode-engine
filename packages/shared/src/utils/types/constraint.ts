import { isString, isFunction, isNil } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/ban-types
export type TypeConstraint = string | Function;

export function validateConstraints(
  args: unknown[],
  constraints: Array<TypeConstraint | undefined>,
): void {
  const len = Math.min(args.length, constraints.length);
  for (let i = 0; i < len; i++) {
    validateConstraint(args[i], constraints[i]);
  }
}

export function validateConstraint(arg: unknown, constraint: TypeConstraint | undefined): void {
  if (isString(constraint)) {
    if (typeof arg !== constraint) {
      throw new Error(`argument does not match constraint: typeof ${constraint}`);
    }
  } else if (isFunction(constraint)) {
    try {
      if (arg instanceof constraint) {
        return;
      }
    } catch {
      // ignore
    }
    if (!isNil(arg) && (arg as any).constructor === constraint) {
      return;
    }
    if (constraint.length === 1 && constraint.call(undefined, arg) === true) {
      return;
    }
    throw new Error(
      `argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true`,
    );
  }
}
