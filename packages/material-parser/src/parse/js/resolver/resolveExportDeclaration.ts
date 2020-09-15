import { namedTypes as t } from 'ast-types';
import makeProxy from '../utils/makeProxy';
import getName from '../utils/getName';

export default function resolveExportDeclaration(path: any) {
  const definitions = [];
  if (path.node.default || t.ExportDefaultDeclaration.check(path.node)) {
    const def = path.get('declaration');
    const meta: { [name: string]: string } = {
      exportName: 'default',
      localName: getName(def),
    };

    definitions.push(makeProxy(def, { __meta: meta }));
  } else if (path.node.declaration) {
    if (t.VariableDeclaration.check(path.node.declaration)) {
      path.get('declaration', 'declarations').each((declarator: any) => {
        definitions.push(
          makeProxy(declarator, {
            __meta: {
              exportName: declarator.get('id').node.name,
            },
          }),
        );
      });
    } else {
      const def = path.get('declaration');
      definitions.push(
        makeProxy(def, {
          __meta: {
            exportName: 'default',
          },
        }),
      );
    }
  } else if (path.node.specifiers) {
    path.get('specifiers').each((specifier: any) => {
      const def = specifier.node.id ? specifier.get('id') : specifier.get('local');
      const exportName = specifier.get('exported').node.name;
      const localName = def.get('local').node.name;

      definitions.push(
        makeProxy(def, {
          __meta: {
            exportName,
            localName,
          },
        }),
      );
    });
  }
  return definitions;
}
