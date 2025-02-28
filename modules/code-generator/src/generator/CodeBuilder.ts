import {
  ChunkContent,
  ChunkType,
  CodeGeneratorError,
  CodeGeneratorFunction,
  ICodeBuilder,
  ICodeChunk,
} from '../types';

export class CodeBuilder implements ICodeBuilder {
  private chunkDefinitions: ICodeChunk[] = [];

  private generators: { [key: string]: CodeGeneratorFunction<ChunkContent> } = {
    [ChunkType.STRING]: (str: string) => str, // no-op for string chunks
    [ChunkType.JSON]: (json: Record<string, unknown>) => JSON.stringify(json), // stringify json to string
  };

  constructor(chunkDefinitions: ICodeChunk[] = []) {
    this.chunkDefinitions = chunkDefinitions;
  }

  /**
   * Links all chunks together based on their requirements. Returns an array
   * of ordered chunk names which need to be compiled and glued together.
   */
  link(chunkDefinitions: ICodeChunk[] = []): string {
    const chunks = chunkDefinitions || this.chunkDefinitions;
    if (chunks.length <= 0) {
      return '';
    }
    const unprocessedChunks = chunks.map((chunk) => {
      return {
        name: chunk.name,
        type: chunk.type,
        content: chunk.content,
        linkAfter: this.cleanupInvalidChunks(chunk.linkAfter, chunks),
      };
    });

    const resultingString: string[] = [];
    const processed = new Set<string>();

    while (unprocessedChunks.length > 0) {
        let indexToRemove = -1;
        for (let index = 0; index < unprocessedChunks.length; index++) {
            if (unprocessedChunks[index].linkAfter.length === 0) {
                indexToRemove = index;
                break;
            }
        }

        if (indexToRemove === -1) {
            throw new CodeGeneratorError(
                'Operation aborted. Reason: cyclic dependency between chunks.',
            );
        }

        const { type, content, name } = unprocessedChunks[indexToRemove];
        const compiledContent = this.generateByType(type, content);
        if (compiledContent) {
            resultingString.push(`${compiledContent}\n`);
        }

        processed.add(name);
        unprocessedChunks.splice(indexToRemove, 1);

        unprocessedChunks.forEach((ch) => {
            ch.linkAfter = ch.linkAfter.filter((after) => !processed.has(after));
        });
    }

    return resultingString.join('\n');
  }

  generateByType(type: string, content: unknown): string {
    if (!content) {
      return '';
    }
    if (Array.isArray(content)) {
      return content.map((contentItem) => this.generateByType(type, contentItem)).join('\n');
    }

    if (!this.generators[type]) {
      throw new Error(
        `Attempted to generate unknown type ${type}. Please register a generator for this type in builder/index.ts`,
      );
    }

    return this.generators[type](content);
  }

  // remove invalid chunks (which did not end up being created) from the linkAfter fields
  // one use-case is when you want to remove the import plugin
  private cleanupInvalidChunks(linkAfter: string[], chunks: ICodeChunk[]) {
    return linkAfter.filter((chunkName) => chunks.some((chunk) => chunk.name === chunkName));
  }
}

export default CodeBuilder;
