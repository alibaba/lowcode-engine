export interface IRegistry {
  /**
   * Adds the extension functions and properties defined by data to the
   * platform. The provided id must be unique.
   * @param id a unique identifier
   * @param data a contribution
   */
  add(id: string, data: any): void;

  /**
   * Returns true iff there is an extension with the provided id.
   * @param id an extension identifier
   */
  knows(id: string): boolean;

  /**
   * Returns the extension functions and properties defined by the specified key or null.
   * @param id an extension identifier
   */
  as<T>(id: string): T;
}

class RegistryImpl implements IRegistry {
  private readonly data = new Map<string, any>();

  public add(id: string, data: any): void {
    this.data.set(id, data);
  }

  public knows(id: string): boolean {
    return this.data.has(id);
  }

  public as(id: string): any {
    return this.data.get(id) || null;
  }
}

export const Registry: IRegistry = new RegistryImpl();
