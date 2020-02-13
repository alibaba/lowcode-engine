export function parseCode(code: string): string {
  try {
    return JSON.parse(code);
  } catch (e) {
    return code;
  }
}
