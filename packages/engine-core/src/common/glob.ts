export interface IRelativePattern {
  /**
   * A base file path to which this pattern will be matched against relatively.
   */
  readonly base: string;

  /**
   * A file glob pattern like `*.{ts,js}` that will be matched on file paths
   * relative to the base path.
   *
   * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
   * the file glob pattern will match on `index.js`.
   */
  readonly pattern: string;
}

export interface IExpression {
  [pattern: string]: boolean | SiblingClause;
}

interface SiblingClause {
  when: string;
}
