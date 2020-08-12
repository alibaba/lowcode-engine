/* eslint-disable @typescript-eslint/no-useless-constructor */
export class CodeGeneratorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ComponentValidationError extends CodeGeneratorError {
  constructor(errorString: string) {
    super(errorString);
  }
}

export class CompatibilityError extends CodeGeneratorError {
  constructor(errorString: string) {
    super(errorString);
  }
}

export class PublisherError extends CodeGeneratorError {
  constructor(errorString: string) {
    super(errorString);
  }
}
