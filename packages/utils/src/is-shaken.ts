const SHAKE_DISTANCE = 4;
/**
 * mouse shake check
 */
export function isShaken(e1: MouseEvent | DragEvent, e2: MouseEvent | DragEvent): boolean {
  if ((e1 as any).shaken) {
    return true;
  }
  if (e1.target !== e2.target) {
    return true;
  }
  return (
    Math.pow(e1.clientY - e2.clientY, 2) + Math.pow(e1.clientX - e2.clientX, 2) > SHAKE_DISTANCE
  );
}
