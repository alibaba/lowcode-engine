import { Events } from '@alilc/lowcode-shared';
import { Registry, Extensions } from '../extension/registry';
import { getCompressedContent, type IJSONSchema } from './jsonSchema';

export interface ISchemaContributions {
  schemas: { [id: string]: IJSONSchema };
}

export interface IJSONContributionRegistry {
  readonly onDidChangeSchema: Events.Event<string>;

  /**
   * Register a schema to the registry.
   */
  registerSchema(uri: string, unresolvedSchemaContent: IJSONSchema): void;

  /**
   * Notifies all listeners that the content of the given schema has changed.
   * @param uri The id of the schema
   */
  notifySchemaChanged(uri: string): void;

  /**
   * Get all schemas
   */
  getSchemaContributions(): ISchemaContributions;

  /**
   * Gets the (compressed) content of the schema with the given schema ID (if any)
   * @param uri The id of the schema
   */
  getSchemaContent(uri: string): string | undefined;

  /**
   * Returns true if there's a schema that matches the given schema ID
   * @param uri The id of the schema
   */
  hasSchemaContent(uri: string): boolean;
}

class JSONContributionRegistryImpl implements IJSONContributionRegistry {
  private _onDidChangeSchema = new Events.Emitter<string>();
  onDidChangeSchema = this._onDidChangeSchema.event;

  private schemasById: { [id: string]: IJSONSchema };

  constructor() {
    this.schemasById = {};
  }

  registerSchema(uri: string, unresolvedSchemaContent: IJSONSchema): void {
    this.schemasById[uri] = unresolvedSchemaContent;
    this._onDidChangeSchema.notify(uri);
  }

  notifySchemaChanged(uri: string): void {
    this._onDidChangeSchema.notify(uri);
  }

  getSchemaContributions(): ISchemaContributions {
    return {
      schemas: this.schemasById,
    };
  }

  getSchemaContent(uri: string): string | undefined {
    const schema = this.schemasById[uri];
    return schema ? getCompressedContent(schema) : undefined;
  }

  hasSchemaContent(uri: string): boolean {
    return !!this.schemasById[uri];
  }
}

export const JSONContributionRegistry = new JSONContributionRegistryImpl();

Registry.add(Extensions.JSONContribution, JSONContributionRegistry);
