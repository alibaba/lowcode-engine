export interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray;
}
export type JsonArray = Array<string | number | boolean | Date | Json | JsonArray>;
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
