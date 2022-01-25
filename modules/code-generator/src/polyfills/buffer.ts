import { Buffer } from 'buffer';

declare const self: any;

if (self && !self.Buffer) {
  Object.assign(self, {
    Buffer,
  });
}
