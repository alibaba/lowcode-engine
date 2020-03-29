export class SymbolManager {
  private symbolMap: { [symbolName: string]: symbol } = {};

  create(name: string): symbol {
    if (this.symbolMap[name]) {
      return this.symbolMap[name];
    }
    this.symbolMap[name] = Symbol(name);
    return this.symbolMap[name];
  }

  get(name: string) {
    return this.symbolMap[name];
  }
}

export default new SymbolManager();
