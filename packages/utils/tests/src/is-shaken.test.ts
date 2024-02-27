import { isShaken } from '../../src/is-shaken';

describe('isShaken', () => {
  it('should return true if e1 has shaken property', () => {
    const e1: any = { shaken: true };
    const e2: MouseEvent | DragEvent = { target: null } as MouseEvent | DragEvent;

    expect(isShaken(e1, e2)).toBe(true);
  });

  it('should return true if e1.target and e2.target are different', () => {
    const e1: MouseEvent | DragEvent = { target: {} } as MouseEvent | DragEvent;
    const e2: MouseEvent | DragEvent = { target: {} } as MouseEvent | DragEvent;

    expect(isShaken(e1, e2)).toBe(true);
  });

  it('should return false if e1 and e2 targets are the same and distance is less than SHAKE_DISTANCE', () => {
    const target = {};
    const e1: MouseEvent | DragEvent = { target: target } as MouseEvent | DragEvent;
    const e2: MouseEvent | DragEvent = { target: target } as MouseEvent | DragEvent;

    // Assuming SHAKE_DISTANCE is 100
    e1.clientY = 50;
    e2.clientY = 50;

    e1.clientX = 60;
    e2.clientX = 60;

    expect(isShaken(e1, e2)).toBe(false);
  });

  it('should return true if e1 and e2 targets are the same and distance is greater than SHAKE_DISTANCE', () => {
    const e1: MouseEvent | DragEvent = { target: {} } as MouseEvent | DragEvent;
    const e2: MouseEvent | DragEvent = { target: {} } as MouseEvent | DragEvent;

    // Assuming SHAKE_DISTANCE is 100
    e1.clientY = 50;
    e1.clientX = 50;
    e2.clientY = 200;
    e2.clientX = 200;

    expect(isShaken(e1, e2)).toBe(true);
  });
});
