import {
  CodeGeneratorError,
  ComponentValidationError,
  CompatibilityError,
  PublisherError,
} from '../../src/types/error';

test('CodeGeneratorError should be instance of CodeGeneratorError', () => {
  const err = new CodeGeneratorError('test');
  expect(err instanceof CodeGeneratorError).toBeTruthy();
});

test('ComponentValidationError should be instance of ComponentValidationError', () => {
  const err = new ComponentValidationError('test');
  expect(err instanceof ComponentValidationError).toBeTruthy();
});

test('ComponentValidationError should be instance of CodeGeneratorError', () => {
  const err = new ComponentValidationError('test');
  expect(err instanceof CodeGeneratorError).toBeTruthy();
});

test('CompatibilityError should be instance of CompatibilityError', () => {
  const err = new CompatibilityError('test');
  expect(err instanceof CompatibilityError).toBeTruthy();
});

test('CompatibilityError should be instance of CodeGeneratorError', () => {
  const err = new CompatibilityError('test');
  expect(err instanceof CodeGeneratorError).toBeTruthy();
});

test('PublisherError should be instance of PublisherError', () => {
  const err = new PublisherError('test');
  expect(err instanceof PublisherError).toBeTruthy();
});

test('PublisherError should be instance of CodeGeneratorError', () => {
  const err = new PublisherError('test');
  expect(err instanceof CodeGeneratorError).toBeTruthy();
});
