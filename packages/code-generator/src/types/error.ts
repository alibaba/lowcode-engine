/* eslint-disable @typescript-eslint/no-useless-constructor */
export class CodeGeneratorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ComponentValidationError extends CodeGeneratorError {
}

export class CompatibilityError extends CodeGeneratorError {
}

export class PublisherError extends CodeGeneratorError {
}
