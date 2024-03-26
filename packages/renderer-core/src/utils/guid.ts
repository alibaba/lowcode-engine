let idStart = 0x0907;

/**
 * Generate unique id
 */
export function guid(): number {
  return idStart++;
}
