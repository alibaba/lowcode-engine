export class CodeGeneratorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class ComponentValidationError extends CodeGeneratorError {
}

// tslint:disable-next-line: max-classes-per-file
export class CompatibilityError extends CodeGeneratorError {
}

// tslint:disable-next-line: max-classes-per-file
export class PublisherError extends CodeGeneratorError {
}
