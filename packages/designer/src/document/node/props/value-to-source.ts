function propertyNameRequiresQuotes(propertyName: string) {
  try {
    const context = {
      worksWithoutQuotes: false,
    };

    // eslint-disable-next-line no-new-func
    new Function('ctx', `ctx.worksWithoutQuotes = {${propertyName}: true}['${propertyName}']`)();

    return !context.worksWithoutQuotes;
  } catch (ex) {
    return true;
  }
}

function quoteString(str: string, { doubleQuote }: any) {
  return doubleQuote ? `"${str.replace(/"/gu, '\\"')}"` : `'${str.replace(/'/gu, '\\\'')}'`;
}

export function valueToSource(
  value: any,
  {
    circularReferenceToken = 'CIRCULAR_REFERENCE',
    doubleQuote = true,
    includeFunctions = true,
    includeUndefinedProperties = false,
    indentLevel = 0,
    indentString = '  ',
    lineEnding = '\n',
    visitedObjects = new Set(),
  }: any = {},
): any {
  switch (typeof value) {
    case 'boolean':
      return value ? `${indentString.repeat(indentLevel)}true` : `${indentString.repeat(indentLevel)}false`;
    case 'function':
      if (includeFunctions) {
        return `${indentString.repeat(indentLevel)}${value}`;
      }
      return null;
    case 'number':
      return `${indentString.repeat(indentLevel)}${value}`;
    case 'object':
      if (!value) {
        return `${indentString.repeat(indentLevel)}null`;
      }

      if (visitedObjects.has(value)) {
        return `${indentString.repeat(indentLevel)}${circularReferenceToken}`;
      }

      if (value instanceof Date) {
        return `${indentString.repeat(indentLevel)}new Date(${quoteString(value.toISOString(), {
          doubleQuote,
        })})`;
      }

      if (value instanceof Map) {
        return value.size
          ? `${indentString.repeat(indentLevel)}new Map(${valueToSource([...value], {
            circularReferenceToken,
            doubleQuote,
            includeFunctions,
            includeUndefinedProperties,
            indentLevel,
            indentString,
            lineEnding,
            visitedObjects: new Set([value, ...visitedObjects]),
          }).slice(indentLevel * indentString.length)})`
          : `${indentString.repeat(indentLevel)}new Map()`;
      }

      if (value instanceof RegExp) {
        return `${indentString.repeat(indentLevel)}/${value.source}/${value.flags}`;
      }

      if (value instanceof Set) {
        return value.size
          ? `${indentString.repeat(indentLevel)}new Set(${valueToSource([...value], {
            circularReferenceToken,
            doubleQuote,
            includeFunctions,
            includeUndefinedProperties,
            indentLevel,
            indentString,
            lineEnding,
            visitedObjects: new Set([value, ...visitedObjects]),
          }).slice(indentLevel * indentString.length)})`
          : `${indentString.repeat(indentLevel)}new Set()`;
      }

      if (Array.isArray(value)) {
        if (!value.length) {
          return `${indentString.repeat(indentLevel)}[]`;
        }

        const itemsStayOnTheSameLine = value.every(
          item => typeof item === 'object' &&
          item &&
          !(item instanceof Date) &&
          !(item instanceof Map) &&
          !(item instanceof RegExp) &&
          !(item instanceof Set) &&
          (Object.keys(item).length || value.length === 1),
        );

        let previousIndex: number | null = null;

        value = value.reduce((items, item, index) => {
          if (previousIndex !== null) {
            for (let i = index - previousIndex - 1; i > 0; i -= 1) {
              items.push(indentString.repeat(indentLevel + 1));
            }
          }

          previousIndex = index;

          item = valueToSource(item, {
            circularReferenceToken,
            doubleQuote,
            includeFunctions,
            includeUndefinedProperties,
            indentLevel: itemsStayOnTheSameLine ? indentLevel : indentLevel + 1,
            indentString,
            lineEnding,
            visitedObjects: new Set([value, ...visitedObjects]),
          });

          if (item === null) {
            items.push(indentString.repeat(indentLevel + 1));
          } else if (itemsStayOnTheSameLine) {
            items.push(item.slice(indentLevel * indentString.length));
          } else {
            items.push(item);
          }

          return items;
        }, []);

        return itemsStayOnTheSameLine
          ? `${indentString.repeat(indentLevel)}[${value.join(', ')}]`
          : `${indentString.repeat(indentLevel)}[${lineEnding}${value.join(
            `,${lineEnding}`,
          )}${lineEnding}${indentString.repeat(indentLevel)}]`;
      }

      value = Object.keys(value).reduce<string[]>((entries, propertyName) => {
        const propertyValue = value[propertyName];
        const propertyValueString =
            typeof propertyValue !== 'undefined' || includeUndefinedProperties
              ? valueToSource(value[propertyName], {
                circularReferenceToken,
                doubleQuote,
                includeFunctions,
                includeUndefinedProperties,
                indentLevel: indentLevel + 1,
                indentString,
                lineEnding,
                visitedObjects: new Set([value, ...visitedObjects]),
              })
              : null;

        if (propertyValueString) {
          const quotedPropertyName = propertyNameRequiresQuotes(propertyName)
            ? quoteString(propertyName, {
              doubleQuote,
            })
            : propertyName;
          const trimmedPropertyValueString = propertyValueString.slice((indentLevel + 1) * indentString.length);

          if (typeof propertyValue === 'function' && trimmedPropertyValueString.startsWith(`${propertyName}()`)) {
            entries.push(
              `${indentString.repeat(indentLevel + 1)}${quotedPropertyName} ${trimmedPropertyValueString.slice(
                propertyName.length,
              )}`,
            );
          } else {
            entries.push(`${indentString.repeat(indentLevel + 1)}${quotedPropertyName}: ${trimmedPropertyValueString}`);
          }
        }

        return entries;
      }, []);

      return value.length
        ? `${indentString.repeat(indentLevel)}{${lineEnding}${value.join(
          `,${lineEnding}`,
        )}${lineEnding}${indentString.repeat(indentLevel)}}`
        : `${indentString.repeat(indentLevel)}{}`;
    case 'string':
      return `${indentString.repeat(indentLevel)}${quoteString(value, {
        doubleQuote,
      })}`;
    case 'symbol': {
      let key = Symbol.keyFor(value);

      if (typeof key === 'string') {
        return `${indentString.repeat(indentLevel)}Symbol.for(${quoteString(key, {
          doubleQuote,
        })})`;
      }

      key = value.toString().slice(7, -1);

      if (key) {
        return `${indentString.repeat(indentLevel)}Symbol(${quoteString(key, {
          doubleQuote,
        })})`;
      }

      return `${indentString.repeat(indentLevel)}Symbol()`;
    }
    case 'undefined':
      return `${indentString.repeat(indentLevel)}undefined`;
    default:
      return `${indentString.repeat(indentLevel)}undefined`;
  }
}

export function getSource(value: any): string {
  if (value && value.__source) {
    return value.__source;
  }
  let source = valueToSource(value);
  if (source === 'undefined') {
    source = '';
  }
  if (value) {
    try {
      value.__source = source;
    } catch (ex) {
      console.error(ex);
    }
  }
  return source;
}
