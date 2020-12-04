export class DocumentModel {
  a = 1;
  c = {};
  constructor() {
    console.log('xxxxxxxxxxxxxxxxxxxx');
    const b = { x: { y: 2 } };
    const c: number = 2;
    this.a = b?.x?.y;
  }
}